create database BBMO;

use BBMO;

CREATE TABLE logins
(
    userID    int primary key auto_increment,
    username  varchar(255),
    password  varchar(255),
    createdAt datetime default NOW(),
    updatedAt datetime default NOW()
);

CREATE TABLE IF NOT EXISTS donors
(
    donorID         int primary key auto_increment,
    First_Name      varchar(50)  not null,
    Last_Name       varchar(50),
    Gender          char(1),
    ContactNumber   bigint       not null,
    dob             date         not null,
    bloodType       varchar(3)   not null,
    address1        varchar(50)  not null,
    address2        varchar(50),
    address3        varchar(50),
    medical_history varchar(500) not null,
    createdAt       datetime default NOW(),
    updatedAt       datetime default NOW()
);

CREATE TABLE IF NOT EXISTS patients
(
    patientID       int primary key auto_increment,
    First_Name      varchar(50)  not null,
    Last_Name       varchar(50),
    Gender          char(1),
    ContactNumber   bigint       not null,
    dob             date         not null,
    bloodType       varchar(3)   not null,
    address1        varchar(50)  not null,
    address2        varchar(50),
    address3        varchar(50),
    medical_history varchar(500) not null,
    createdAt       datetime default NOW(),
    updatedAt       datetime default NOW()
);

CREATE TABLE IF NOT EXISTS blood
(
    bloodID     int primary key auto_increment,
    bloodType   varchar(3) not null,
    donatedDate date       not null,
    expiryDate  date       not null,
    available   int(1)     not null default 1,
    donorID     int,
    bloodBankID int,
    createdAt   datetime            default NOW(),
    updatedAt   datetime            default NOW()
);

CREATE TABLE IF NOT EXISTS requirements
(
    requestID int primary key auto_increment,
    reason    varchar(50),
    location  varchar(50),
    patientID int,
    createdAt datetime default NOW(),
    updatedAt datetime default NOW()
);

CREATE TABLE IF NOT EXISTS donatedBloods
(
    requestID int primary key,
    reason    varchar(50),
    location  varchar(50),
    bloodID   int,
    patientID int,
    donorID   int,
    createdAt datetime default NOW(),
    updatedAt datetime default NOW()
);

CREATE TABLE bloodBanks
(
    bloodBankID int primary key auto_increment,
    name        varchar(50) not null,
    location    varchar(50) not null,
    createdAt   datetime default NOW(),
    updatedAt   datetime default NOW()
);

ALTER TABLE blood
    ADD FOREIGN KEY (donorID) REFERENCES donors (donorID) ON DELETE CASCADE;
ALTER TABLE blood
    ADD FOREIGN KEY (bloodBankID) REFERENCES bloodBanks (bloodBankID) ON DELETE CASCADE;
ALTER TABLE requirements
    ADD FOREIGN KEY (patientID) REFERENCES patients (patientID) ON DELETE CASCADE;
ALTER TABLE donatedBloods
    ADD FOREIGN KEY (patientID) REFERENCES patients (patientID) ON DELETE CASCADE;
ALTER TABLE donatedBloods
    ADD FOREIGN KEY (donorID) REFERENCES donors (donorID) ON DELETE CASCADE;
ALTER TABLE donors
    ADD CONSTRAINT CHECK (bloodType in ('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'));
ALTER TABLE patients
    ADD CONSTRAINT CHECK (bloodType in ('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'));
ALTER TABLE blood
    ADD CONSTRAINT CHECK (bloodType in ('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'));
ALTER TABLE donors
    ADD CONSTRAINT CHECK (999999999 < ContactNumber < 10000000000);
ALTER TABLE patients
    ADD CONSTRAINT CHECK (999999999 < ContactNumber < 10000000000);

CREATE TRIGGER clearRequest
    AFTER INSERT
    ON donatedBloods
    FOR EACH ROW
    DELETE
    FROM requirements
    WHERE requirements.requestID = NEW.requestID;

CREATE TRIGGER donateBloods
    AFTER INSERT
    ON donatedBloods
    FOR EACH ROW
    UPDATE blood
    SET available=0
    WHERE blood.bloodID = NEW.bloodID;

INSERT INTO donors (First_Name, Last_Name, Gender, ContactNumber, dob, bloodType,
                    address1, address2, address3, medical_history, createdAt, updatedAt)
VALUES ('Shrey', 'Parikh', 'M', 8745212365,
        '2012-1-31', 'AB+', 'Kholi No. 420', 'Prem Gali',
        'Rup Nagar', 'None', now(), now());

INSERT INTO patients (First_Name, Last_Name, Gender, ContactNumber, dob, bloodType,
                      address1, address2, address3, medical_history, createdAt,
                      updatedAt)
VALUES ('ftyvhgvhg', 'yfyvjhhjvjy', 'F', 8796512235,
        '1953-4-12', 'AB-', 'yruegidfhjb', 'urtihgkdjf',
        'tywfhgdsa', 'oiuykjlgh', now(), now());

INSERT INTO bloodBanks (name, location, createdAt, updatedAt)
VALUES ('Maharana pratap singh', 'udaipur', now(), now());

INSERT INTO blood (bloodType, donatedDate, expiryDate, createdAt,
                   updatedAt, bloodBankID, donorID)
VALUES ('AB+', now(), '2022-1-12', now(), now(), 1, 1);
