import csv
import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

DATA_FILE = 'data.csv'
MODEL_FILE = 'model.p'


def load_data():
    features = []
    labels = []
    with open(DATA_FILE, 'r') as file:
        reader = csv.reader(file)
        next(reader)
        for row in reader:
            labels.append(row[0])
            features.append([float(value) for value in row[1:]])
    return np.array(features), np.array(labels)


def main():
    x, y = load_data()
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, shuffle=True, stratify=y)
    model = RandomForestClassifier(n_estimators=100)
    model.fit(x_train, y_train)
    predictions = model.predict(x_test)
    print('Accuracy: ' + str(round(accuracy_score(y_test, predictions) * 100, 2)) + '%')
    with open(MODEL_FILE, 'wb') as file:
        pickle.dump(model, file)
    print('Saved model to ' + MODEL_FILE)


if __name__ == '__main__':
    main()
