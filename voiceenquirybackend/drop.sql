USE my_flask_app_db;

-- Create UserTable first
CREATE TABLE UserTable(
    ID serial,
    Email varchar(40) NOT NULL UNIQUE,
    Name varchar(30),
    Password varchar(15) NOT NULL,
    Usertype varchar(10) NOT NULL,
    PRIMARY KEY (ID)
);

-- Create NonAdmin table
CREATE TABLE NonAdmin(
    ID serial,
    Gender varchar(7),
    Phone numeric(10,0) NOT NULL UNIQUE CONSTRAINT Phone1_chk CHECK(Phone > 999999999),
    Address varchar(100),
    PRIMARY KEY(ID),
    FOREIGN KEY(ID) REFERENCES UserTable(ID) ON DELETE CASCADE
);

-- Create Admin table
CREATE TABLE Admin(
    ID serial,
    AgencyName  varchar(35) NOT NULL,
    AgencyPhone varchar(10) NOT NULL UNIQUE CONSTRAINT Phone2_chk CHECK(AgencyPhone > 999999999),
    AgencyOffice varchar(50),
    PRIMARY KEY(AgencyName),
    FOREIGN KEY(ID) REFERENCES UserTable(ID) ON DELETE CASCADE
);

-- Create BusInfo table
CREATE TABLE BusInfo(
    BusRegnNo varchar(15) NOT NULL,
    AgencyName varchar(35) NOT NULL,
    TotalSeats integer DEFAULT 40,
    AC numeric(1) DEFAULT 0,
    LocationName varchar(20),
    Latitude numeric(17,10),
    Longitude numeric(17,10),
    PRIMARY KEY(BusRegnNo),
    FOREIGN KEY(AgencyName) REFERENCES Admin(AgencyName) ON DELETE CASCADE
);

-- Create AgencyDetails table
CREATE TABLE AgencyDetails(
    AgencyName varchar(35) NOT NULL,
    AgencyAddress varchar(50) NOT NULL
);

-- Create BusSchedule table
CREATE TABLE BusSchedule(
    BusRegnNo varchar(15) NOT NULL,
    RouteID integer NOT NULL CONSTRAINT Routeid1_chk CHECK(RouteID > 0),
    DriverID integer UNIQUE CONSTRAINT Driverid1_chk CHECK(DriverID > 0),
    StartTime numeric(4,2) CONSTRAINT Start_chk1 CHECK(StartTime >= 0 AND StartTime < 2400),
    Fare integer CONSTRAINT fair_chk CHECK(Fare > 0),
    ReservedSeats integer DEFAULT 0,
    TravelTime numeric(10) CONSTRAINT EstTim1_chk CHECK(Traveltime > 0),
    PRIMARY KEY(RouteID, DriverID, StartTime),
    FOREIGN KEY(BusRegnNo) REFERENCES BusInfo(BusRegnNo) ON DELETE CASCADE
);

-- Create TimeForTravel table
CREATE TABLE TimeForTravel(
    TravelTime numeric(10) CONSTRAINT EstTim2_chk CHECK(Traveltime > 0),
    StartTime numeric(4,2) CONSTRAINT Start1_check CHECK(StartTime >= 0 AND StartTime < 24),
    EndTime numeric(4,2) CONSTRAINT End1_chk CHECK(EndTime >= 0 AND EndTime < 24),
    PRIMARY KEY(TravelTime, StartTime)
);

-- Create RouteDetails table
CREATE TABLE RouteDetails(
    RouteID integer CONSTRAINT Routeid4_chk CHECK(RouteID > 0),
    RouteName varchar(30) NOT NULL,
    Source varchar(30) NOT NULL,
    Destination varchar(30) NOT NULL
);

-- Create BusStops table
CREATE TABLE BusStops(
    RouteID integer NOT NULL CONSTRAINT Routeid_chk CHECK(RouteID > 0),
    IntermediateStops varchar(20) NOT NULL,
    StopNumber integer NOT NULL CONSTRAINT Stop_num CHECK(StopNumber > 0)
);

-- Create DriverDetails table
CREATE TABLE DriverDetails(
    DriverID serial,
    DriverName varchar(20) NOT NULL,
    DriverPhone numeric(10) CONSTRAINT Phone3_chk CHECK(DriverPhone > 999999999),
    Age numeric(3) CONSTRAINT CHECK(Age > 0),
    Date_Of_Join date,
    PRIMARY KEY(DriverID)
);

-- Create Ticket table
CREATE TABLE Ticket(
    BusRegnNo varchar(15) NOT NULL,
    TicketPNR serial,
    BookingDate date,
    TravelDate date, 
    PRIMARY KEY(TicketPNR),
    CONSTRAINT dat_chk CHECK(TravelDate > BookingDate + 2),
    FOREIGN KEY(BusRegnNo) REFERENCES BusInfo(BusRegnNo)
);

-- Create SeatsBooked table
CREATE TABLE SeatsBooked(
    TicketPNR serial,
    BookedSeats integer,
    PRIMARY KEY(TicketPNR, BookedSeats)
);

-- Create SeatInfo table
CREATE TABLE SeatInfo(
    BusRegnNo varchar(15) NOT NULL UNIQUE, 
    SeatNo integer CONSTRAINT SeatNo_chk CHECK(SeatNo > 40),
    Sleeper numeric(1) DEFAULT 0,
    FOREIGN KEY(BusRegnNo) REFERENCES BusInfo(BusRegnNo) ON DELETE CASCADE
);

-- Create Passenger table
CREATE TABLE Passenger(
    ID serial,
    BusRegnNo varchar(15) NOT NULL,
    PassengerID integer CONSTRAINT passid_chk CHECK(PassengerID > 0),
    PassengerName varchar(20),
    PassengeGender varchar(7),
    Age integer CONSTRAINT age2_chk CHECK(Age > 5),
    PRIMARY KEY(PassengerID),
    FOREIGN KEY(ID) REFERENCES NonAdmin(ID) ON DELETE CASCADE,
    FOREIGN KEY(BusRegnNo) REFERENCES BusInfo(BusRegnNo)
);

-- Create Through table
CREATE TABLE Through(
    RouteID integer,
    DriverID integer,
    StartTime numeric(4,2),
    BusRegnNo integer NOT NULL,
    TicketPNR integer NOT NULL CONSTRAINT pnr4_chk CHECK(TicketPNR > 0),
    PRIMARY KEY(RouteID, DriverID, StartTime, TicketPNR)
);

-- Insert into DriverDetails
INSERT INTO DriverDetails VALUES('126', 'Prithvi', '9834534565', '29', '2017-09-22');

-- Insert into BusStops
-- Insert stops for Route 4 (Bangalore to Chennai)
INSERT INTO BusStops (RouteId, IntermediateStops, StopNumber) 
VALUES 
('4', 'Chennai', '7'), 
('4', 'Bangalore', '6');

-- Insert stops for Route 3 (Chennai to Bangalore)
INSERT INTO BusStops (RouteId, IntermediateStops, stopNumber) 
VALUES 
('3', 'Chennai', '1'), 
('3', 'Bangalore', '2');

-- Insert stops for Route 2 (Bangalore to Tirupur)
INSERT INTO BusStops (RouteId, IntermediateStops, stopNumber) 
VALUES 
('2', 'Bangalore', '1'), 
('2', 'Tirupur', '2');

-- Insert into RouteDetails
INSERT INTO RouteDetails VALUES('4', 'BGL-CNI', 'Bangalore', 'Chennai');
INSERT INTO RouteDetails VALUES('3', 'CNI-BGL', 'Chennai', 'Bangalore');
INSERT INTO RouteDetails VALUES('2', 'BGL-TRR', 'Bangalore', 'Tirupur');

-- Insert into TimeForTravel
INSERT INTO TimeForTravel VALUES('12', '17.30', '05.30');
INSERT INTO TimeForTravel VALUES('15', '19.00', '10.00');
INSERT INTO TimeForTravel VALUES('14', '19.45', '09.45');
INSERT INTO TimeForTravel VALUES('15', '19.15', '10.15');
INSERT INTO TimeForTravel VALUES('17', '19.00', '12.00');

-- Insert into Through
INSERT INTO Through VALUES('1', '121', '17.30', '0', '1003');
INSERT INTO Through VALUES('1', '122', '19.00', '0', '1004');
INSERT INTO Through VALUES('2', '123', '19.45', '0', '1001');
INSERT INTO Through VALUES('3', '124', '19.15', '0', '1005');

-- Create trigger for TimeTravel
DELIMITER $$
CREATE TRIGGER TimeTravel AFTER INSERT ON BusSchedule
FOR EACH ROW 
BEGIN
    IF(NEW.TravelTime + NEW.StartTime > 24.00) THEN
        INSERT INTO TimeForTravel(TravelTime, StartTime, EndTime)
        VALUES(NEW.TravelTime, NEW.StartTime, NEW.TravelTime + NEW.StartTime - 24);
    ELSE
        INSERT INTO TimeForTravel(TravelTime, StartTime, EndTime)
        VALUES(NEW.TravelTime, NEW.StartTime, NEW.TravelTime + NEW.StartTime);
    END IF;
END$$
DELIMITER ;

-- Create stored procedure for total revenue
DELIMITER $$
CREATE PROCEDURE totalrevenue()
BEGIN
    SELECT AgencyName, SUM(Fare) FROM BusInfo NATURAL JOIN BusSchedule GROUP BY AgencyName;
END$$
DELIMITER ;

-- Call procedure
CALL totalrevenue();
SELECT distinct RouteId 
FROM BusStops 
WHERE RouteId IN (
  SELECT RouteId FROM BusStops WHERE IntermediateStops = 'Bangalore'
) 
AND RouteId IN (
  SELECT RouteId FROM BusStops WHERE IntermediateStops = 'Chennai'
);
ALTER TABLE RouteDetails ADD PRIMARY KEY (RouteID);
ALTER TABLE SeatsBooked ADD FOREIGN KEY (TicketPNR) REFERENCES Ticket(TicketPNR);
-- Check for a valid route between two cities (e.g., Bangalore to Chennai)
SELECT DISTINCT RouteId 
FROM BusStops 
WHERE IntermediateStops = 'Bangalore' 
AND RouteId IN (
  SELECT RouteId 
  FROM BusStops 
  WHERE IntermediateStops = 'Chennai'
);
SELECT * FROM BusSchedule WHERE RouteID IN (3, 4);
-- Inserting into Admin table first
-- Inserting into UserTable
INSERT INTO UserTable (Email, Name, Password, Usertype)
VALUES
('admin1@example.com', 'Admin One', 'password123', 'Admin'),
('admin2@example.com', 'Admin Two', 'password456', 'Admin');
-- Insert into Admin using the retrieved IDs from UserTable
INSERT INTO Admin (ID, AgencyName, AgencyPhone, AgencyOffice)  
VALUES  
(1, 'ABC Travels', '1234567890', 'Bangalore'),  
(2, 'CDE Travels', '9876543210', 'Chennai');
-- Insert into BusInfo after Admin
INSERT INTO BusInfo (BusRegnNo, AgencyName, TotalSeats, AC, LocationName, Latitude, Longitude)  
VALUES  
('1234', 'ABC Travels', 40, 1, 'Bangalore', 12.9716, 77.5946),  
('5678', 'CDE Travels', 45, 0, 'Chennai', 13.0827, 80.2707);

INSERT INTO BusSchedule (BusRegnNo, RouteID, DriverID, StartTime, Fare, ReservedSeats, TravelTime)
VALUES 
('1234', 3, 101, 17.30, 500, 0, 5),
('5678', 4, 102, 19.00, 600, 0, 6);
ALTER TABLE Ticket DROP CONSTRAINT dat_chk;

select * from seatsbooked;

SELECT DISTINCT RouteId 
FROM BusStops 
WHERE IntermediateStops = 'Bangalore' 
AND RouteId IN (
  SELECT RouteId 
  FROM BusStops 
  WHERE IntermediateStops = 'Chennai'
);
SELECT * FROM BusSchedule WHERE RouteID IN (3, 4);

INSERT INTO RouteDetails (RouteID, RouteName, Source, Destination) VALUES
(5, 'BGL-COI', 'Bangalore', 'Coimbatore'),
(6, 'CNI-COI', 'Chennai', 'Coimbatore');
-- Adding stops for Route 5 (Bangalore to Coimbatore)
INSERT INTO BusStops (RouteId, IntermediateStops, StopNumber) 
VALUES 
(5, 'Bangalore', 1), 
(5, 'Coimbatore', 2);

-- Adding stops for Route 6 (Chennai to Coimbatore)
INSERT INTO BusStops (RouteId, IntermediateStops, StopNumber) 
VALUES 
(6, 'Chennai', 1), 
(6, 'Coimbatore', 2);
INSERT INTO BusInfo (BusRegnNo, AgencyName, TotalSeats, AC, LocationName, Latitude, Longitude)  
VALUES  
('9012', 'ABC Travels', 50, 1, 'Bangalore', 12.9716, 77.5946),  
('3456', 'CDE Travels', 45, 0, 'Chennai', 13.0827, 80.2707);
INSERT INTO BusSchedule (BusRegnNo, RouteID, DriverID, StartTime, Fare, ReservedSeats, TravelTime)
VALUES 
    ('9012', 5, 105, 16.00, 750, 0, 6),   -- Bangalore to Coimbatore (EndTime = 24.00)
    ('3456', 6, 106, 17.00, 800, 0, 4);   -- Chennai to Coimbatore (Adjusted TravelTime to 4)







