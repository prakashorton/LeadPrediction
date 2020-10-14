import flask
import pyodbc
import simplejson
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from decimal import Decimal
from flask import request, jsonify
from flask_cors import CORS, cross_origin
import joblib
from sklearn.preprocessing import StandardScaler

app = flask.Flask(__name__)
app.config["DEBUG"] = True
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

conn = pyodbc.connect('Driver={SQL Server};'
						  'Server=CHN-DEV134;'
						  'Database=LeadCapture;'
						  'Trusted_Connection=yes;')
						  

@app.route('/Login', methods = ['POST'])
def Login():
	content = request.get_json()
	cursor = conn.cursor()
	cursor.execute("select Id from [User] where [UserName] = ? AND [Password] =?", (content["userName"], content["password"]))
	rows= cursor.fetchone()
	if rows is None :
		return str("")
	else:
		return str(rows[0])


@app.route('/GetPredictionData', methods=['Get'])
def GetPredictionData():
    cursor = conn.cursor()
    id = request.args.get('id')
    cursor.execute('select * from [leadinformation] where [ConvertedType]=0 AND AdvisorId=?',(id))
    columns = [column[0] for column in cursor.description]
    results=[]
    for row in cursor:
        results.append(dict(zip(columns, row)))
    Leaddataset= simplejson.dumps({"Leads":results})
    cursor.execute('select * from [advisorSetting] where AdvisorId=?',(id))
    rows= cursor.fetchone()
    if rows is None:
        return simplejson.dumps(results)
    else:
        columns = [column[0] for column in cursor.description]
        advisorSettingResults =(dict(zip(columns, rows)))
        settings= simplejson.dumps(advisorSettingResults)
        output = calculateDesirability(Leaddataset,settings)
        return simplejson.dumps(output)


def GetLeadProbability(leadDetails):
	lr = joblib.load('LeadModel.pkl')
	testData = [[leadDetails[0], leadDetails[1],leadDetails[2],leadDetails[3],leadDetails[4],leadDetails[5]]]
	sc = joblib.load('LeadSc.pkl')
	data= sc.transform(testData)
	prediction = list(lr.predict_proba(data))
	return round(prediction[0][1]*100,2)

@app.route('/UpdateLeadInformation', methods = ['POST'])
def UpdateLeadInformation():
	content = request.get_json()
	cursor = conn.cursor()
	cursor.execute("update LeadInformation set ConvertedType = ? where AdvisorId =  ? AND LeadId = ? ", (content["IsConverted"], content["AdvisorId"],content["LeadId"]))
	print(cursor.rowcount)
	conn.commit()
	if cursor.rowcount > 0 :
		return str(True)
	else:
		return str(False)

@app.route('/AddLeadCapture', methods = ['POST'])
def AddLeadCapture():
	content = request.get_json()
	probability = GetLeadProbability([1,content["Age"],content["Income"],content["NetWorth"],content["Gender"],content["GoalType"]])
	cursor = conn.cursor()
	cursor.execute('''INSERT INTO [dbo].[LeadInformation]
           ([AdvisorId]
           ,[Name]
           ,[Age]
		   ,[Gender]
           ,[Income]
           ,[Networth]
           ,[GoalType]
           ,[ConvertedType]
           ,[Probability])
     VALUES (?,?,?,?,?,?,?,?,?)''',
	(content["AdvisorId"], content["Name"],content["Age"],content["Gender"],content["Income"],content["NetWorth"],content["GoalType"],0,probability))
	conn.commit()

	goal = ''
	if content["GoalType"] == 1:
		goal = 'Savings'
	else:
		goal = 'Retirement'
	if cursor.rowcount > 0 :
		sendEmail(content["Email"],content["AdvisorName"], goal,content["Name"])
		return str(True)
	else:
		return str(False)

@app.route('/GetDesirablity', methods=['GET'])
def GetDesirablity():
	id = request.args.get('id')
	cursor = conn.cursor()
	cursor.execute('select * from [advisorSetting] where AdvisorId=?',(id))
	columns = [column[0] for column in cursor.description]
	results=[]
	for row in cursor:
		results.append(dict(zip(columns, row)))
	return simplejson.dumps(results)

@app.route('/UpdateDesirablity', methods = ['POST'])
def UpdateDesirablity():
	content = request.get_json()
	cursor = conn.cursor()
	cursor.execute('''
		UPDATE [dbo].[AdvisorSetting]
		SET IsAgeAbove = ?
		  ,Age = ?
		  ,IsIncomeAbove = ?
		  ,Income = ?
		  ,IsNetworthAbove = ?
		  ,Networth = ?
		  ,GoalType = ?
		WHERE AdvisorId= ?
		''', (content["Age"]["Criteria"], content["Age"]["Value"],content["Income"]["Criteria"],content["Income"]["Value"],
			content["Networth"]["Criteria"],content["Networth"]["Value"] ,content["GoalType"],content["AdvisorId"]))
	conn.commit()
	if cursor.rowcount > 0 :
		return str(True)
	else:
		cursor = conn.cursor()
		cursor.execute('''INSERT INTO [dbo].[AdvisorSetting]
           ([AdvisorId]
           ,[IsAgeAbove]
           ,[Age]
           ,[IsIncomeAbove]
           ,[Income]
           ,[IsNetworthAbove]
           ,[Networth]
           ,[GoalType])
		VALUES (?,?,?,?,?,?,?,?)''', (content["AdvisorId"], content["Age"]["Criteria"] , content["Age"]["Value"],content["Income"]["Criteria"],content["Income"]["Value"],
			content["Networth"]["Criteria"],content["Networth"]["Value"] ,content["GoalType"]))
		conn.commit()
		if cursor.rowcount > 0 :
			return str(True)
		else:
			return str(False)

def calculateDesirability(leadsData,advisorSetting):
	data_set = simplejson.loads(leadsData)
	settings = simplejson.loads(advisorSetting)
	max_Income = max(data_set['Leads'], key=lambda ev: ev['Income'])['Income']
	max_Networth = max(data_set['Leads'], key=lambda ev: ev['Networth'])['Networth']

	if(settings["IsAgeAbove"] == 1):
		max_Age = max(data_set['Leads'], key=lambda ev: ev['Age'])['Age']
		min_Age = settings["Age"]
	else:
		 min_Age = min(data_set['Leads'], key=lambda ev: ev['Age'])['Age']
		 max_Age = settings["Age"]
	percent_perAge = 100 / (max_Age - min_Age)
	result=[]

	for leads in data_set.items():
		for lead in leads[1]:
			age_percent = 0
			income_percent = 0
			networth_percent = 0
			goalType_percent = 0
			
			#Age
			if ((settings["IsAgeAbove"] == 1 and lead["Age"] >= settings["Age"]) or
				(settings["IsAgeAbove"] == 0 and lead["Age"] <= settings["Age"])):
					age_percent = (lead["Age"] - min_Age) * percent_perAge
			
			#Income
			if ((settings["IsIncomeAbove"] == 1 and lead["Income"] >= settings["Income"]) or 
				(settings["IsAgeAbove"] == 0 and lead["Income"] <= settings["Income"])) :
					income_percent = (lead["Income"] / max_Income) * 100
			
			#Networth
			if ((settings["IsNetworthAbove"] == 1 and lead["Networth"] >= settings["Networth"]) or
				(settings["IsAgeAbove"] == 0 and lead["Networth"] <= settings["Networth"])):
					networth_percent = (lead["Networth"] / max_Networth) * 100

			#GoalType
			if (lead["GoalType"] == settings["GoalType"]):
				goalType_percent = 100
		  
			desirability = (age_percent + income_percent + networth_percent + goalType_percent)/4
			lead["Desirability"]= round(desirability,2)
			result.append(lead)
		return result


@app.route('/GetLeadclientData', methods = ['GET'])
def GetLeadclientData():
    id = request.args.get('id')
    cursor = conn.cursor()
    cursor.execute('select count(*) from [LeadInformation] where AdvisorId= ?',(id))
    total = cursor.fetchone()    
    cursor = conn.cursor()
    cursor.execute('select Probability from [LeadInformation] where AdvisorId= ? AND ConvertedType = 1',(id))
    columns = [column[0] for column in cursor.description]
    results=[0,0,0,0]
    op=[]
    for row in cursor:
        if row[0] < 60 :
            results[0]=results[0]+1
        if row[0] >= 60 and row[0] < 70:
            results[1]=results[1]+1
        if row[0] >=70 and row[0] < 90:
            results[2]=results[2]+1
        if row[0] >= 90 and row[0] < 100 :
            results[3]=results[3]+1
    for x in results:
        op.append(round((x*100) / total[0],2))
    print(op)
    return simplejson.dumps(op)

@app.route('/GetConversionData', methods = ['GET'])
def GetConversionData():
    id = request.args.get('id')
    cursor = conn.cursor()
    cursor.execute('''select sum(case ConvertedType when 1 then 1 else 0 end ) as converted,
                    sum(case ConvertedType  when 2 then 1 else 0 end ) as Notconverted,
                    count(*) as overall
                    from LeadInformation
                    where AdvisorId = ?''',(id))
    total = cursor.fetchone()
    return simplejson.dumps([round((total[0]*100)/ total[2],2),round((total[1]*100)/ total[2],2)])

@app.route('/GetClients', methods=['Get'])
def GetClients():
    cursor = conn.cursor()
    id = request.args.get('id')
    cursor.execute('select * from [leadinformation] where [ConvertedType]!= 0 AND AdvisorId=?',(id))
    columns = [column[0] for column in cursor.description]
    results=[]
    for row in cursor:
        results.append(dict(zip(columns, row)))
    return(simplejson.dumps(results))
	

def sendEmail(to, name, goal, lName):
	msg = MIMEMultipart()
	sender = 'notification@emoneyadvisor.com'
	# to = 'sbaskar@emoneyadvisor.com'
	subject = '''Welcome to Fidelity'''
	body = '''Hello {2},

	Thank you for your time on filling out the financial questionnaire, before we can create an investment plan to achieve your goals.
	We are currently working on your {0} plan to help you meet the goal. 

	I am a certified financial advisor with 10+ years of experience in helping my clients meet their dream goals. I have a wide range of clients who are happy with their  progressing {0} plans and other financial goals. Clients in their early ages have been able to grow their assets in a rate irrespective of the market situations during this pandemic.  
	

	Along with my expertise, you could also experience the product offered by eMoney Advisor with streamlined financial plan creation and an easy-to-follow workflow that delivers an impactful, goals-based client experience.
	detailed planning process which demonstrates tangible outcomes for complex, real-world scenarios.
	 

	I am very excited to meet you so that we can together help you meet your financial goals and help you get there.
	 

	Thanks,
	{1}'''.format(goal, name, lName)

	msg['From'] = sender
	msg['To'] = to
	msg['Subject'] = subject

	 

	msg.attach(MIMEText(body,'plain'))
	text = msg.as_string()

	s = smtplib.SMTP('devmail.emadev.emoneyadvisor.com')
	s.sendmail(sender, to, text)
	s.quit()
    

max_of_items = {}
min_of_items = {}
percent_per_item = {}

def range_calculator(item, condition,data_set,settings):
    if(settings[condition] == 1):
        max_of_items[item] = max(data_set['Leads'], key=lambda ev: ev[item])[item]
        min_of_items[item] = settings[item] 
        pass
    else:
        min_of_items[item] = min(data_set['Leads'], key=lambda ev: ev[item])[item]
        max_of_items[item] = settings[item]
        pass
    percent_per_item[item] = (100 / (max_of_items[item] - min_of_items[item])) if max_of_items[item] != min_of_items[item] else 100

def percent_calculator(item, condition,settings,lead):
    item_percent = 0
    if ((settings[condition] == 1 and lead[item] >= settings[item]) or
        (settings[condition] == 0 and lead[item] <= settings[item])):
        difference = lead[item] - min_of_items[item] if lead[item] != min_of_items[item] else 1
        item_percent = difference * percent_per_item[item]
        pass
    return item_percent



def calculateDesirability(leadsData,advisorSetting):
	data_set = simplejson.loads(leadsData)
	settings = simplejson.loads(advisorSetting)

	range_calculator("Age", "IsAgeAbove",data_set,settings)
	range_calculator("Income", "IsIncomeAbove",data_set,settings)
	range_calculator("Networth", "IsNetworthAbove",data_set,settings)
	result=[]
	for leads in data_set.items():
		for lead in leads[1]:
			age_percent = percent_calculator("Age", "IsAgeAbove",settings,lead)
			income_percent = percent_calculator("Income", "IsIncomeAbove",settings,lead)
			networth_percent = percent_calculator("Networth", "IsNetworthAbove",settings,lead)
			goalType_percent = 0
			
			if (lead["GoalType"] == settings["GoalType"] or settings["GoalType"] == 2):
				goalType_percent = 100
				pass
		  
			desirability = (age_percent + income_percent + networth_percent + goalType_percent)/4
			
			lead["Desirability"]= round(desirability,2)
			result.append(lead)
		return result


app.run(host="localhost", port=8000, debug=True)