LoginPage:
    Model-Usertable
        ID
        UserName
        Password
    API
        Login(userName, password)   -   Boolean -   GET

Desirablity
    Model
        AdvisorId
        Age : {
            'Criteria' : 'Above',
            'Value' : '1000',
        },
        Income: {
            'Criteria' : 'Above',
            'Value' : '1000',
        },
        Networth: {
            'Criteria' : 'Above',
            'Value' : '1000',
        },
        GoalType: 0|`1`|2 
        Retirement, Savings, Both
    API
        GetDesirablity(advisorID)   -   DesirablityModel    -   GET
        UpdateDesirablity(DesirablityModel) -   Boolean -   POST

LeadCapture
    Model
        AdvisorId
        LeadId
        Name
        Income
        Age
        NetWorth
        GoalType
        TimeSpent
        Converted   -   0   |   1   |   2
            NotConverted    Converted   Lead
    
    API
        AddLeadCapture(LeadCaptureModel)    -   Boolean -   POST

Prediction
    PredictionModel
        AdvisorId
        LeadId
        Name
        Probability
        Desirablity -   GET - Setting
    
    UpdateLeadInformation
        AdvisorId
        LeadId
        IsConverted

    API
        GetPredictionData(advisorId)    -    [PredictionModel]  -   GET
        UpdateLeadInformation(updateLeadInformationModel)   -   Boolean -   POST