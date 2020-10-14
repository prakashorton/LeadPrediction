import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

dataset = pd.read_csv("AdvisorLeadConversionHistoricalData.csv", names=["Advisor Id","Age", "Income", "Networth", "Gender", "Goal", "Converted"])
dataset = dataset[['Advisor Id','Age', 'Income', 'Networth',"Gender", "Goal", 'Converted']]
X = dataset.iloc[:, 0:6].values
y = dataset.iloc[:, 6].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)

sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)
joblib.dump(sc, 'LeadSc.pkl')
regressor = RandomForestClassifier(max_depth = 25, min_samples_leaf = 10, min_samples_split = 10, n_estimators= 300, random_state=0)
regressor.fit(X_train, y_train)

joblib.dump(regressor, 'LeadModel.pkl')