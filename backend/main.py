from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime, timedelta
from database import dbconnect
from decimal import Decimal
from typing import Optional


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

#AdminFixedDetails
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "1234"

class Admin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    name: str
    username: str
    password: str
    email: str
    contactNumber: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    name: str
    username: str
    email: str
    contactNumber: str

class Booking(BaseModel):
    userID: int
    eventID: int
    quantity: int = Field(ge=0)

class BookingUpdate(BaseModel):
    bookStatus: str
    quantity: int = Field(ge=0)

class Event(BaseModel):
    eventName: str
    description: Optional[str] = None
    venue: str
    eventImage: Optional[str] = None
    startTime: datetime
    endTime: datetime
    price: Decimal = Field(ge=0)
    totalTickets: int = Field(gt=0)
    currentStatus: str="Upcoming"

class EventUpdate(BaseModel):
    eventName: str
    description: Optional[str] = None
    venue: str
    eventImage: Optional[str] = None
    startTime: datetime
    endTime: datetime
    price: Decimal
    totalTickets: int = Field(gt=0)
    availableTickets: int = Field(ge=0)
    currentStatus: str

#AccountRegistration
#register
@app.post("/register")
def addUser(user: User):

    db = dbconnect()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT userID FROM user
        WHERE username = %s, OR email = %s
    """,
    (user.username, user.email)
    )

    userExist = cursor.fetchone()

    if userExist:
        cursor.close()
        db.close()

        raise HTTPException(400, "Username or email already exists!")

    cursor.execute(
        """
        INSERT INTO user(name, username, password, email, contactNumber)
        VALUES (%s, %s, %s, %s, %s)
    """,
    (
        user.name,
        user.username,
        user.password,
        user.email,
        user.contactNumber
    )
    )

    db.commit()
    id = cursor.lastrowid

    cursor.close()
    db.close()

    return{
        "message": "Registration successful",
        "userID": id
    }

#userLogin
@app.post("/login")
def userLogin(user: UserLogin):
    db = dbconnect()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT userID, name, username, email, contactNumber 
        FROM user
        WHERE username = %s AND password = %s
    """,
    (user.username, user.password)
    )

    userlogin = cursor.fetchone()

    cursor.close()
    db.close()

    if not userlogin:
        raise HTTPException(401, "Invalid username or password")

    return {
        "message": "Login successful!",
        "user": userlogin
    }

#adminLogin
@app.post("/admin/login")
def adminLogin(admin: Admin):
    if(admin.username == ADMIN_USERNAME
       and admin.password == ADMIN_PASSWORD
       ):
        return{
            "message": "Admin login successful",
            "username": ADMIN_USERNAME
        }

    raise HTTPException(401, "Invalid admin username or password.")

#viewUsers
@app.get("/user")
def viewUser():
    db = dbconnect()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT userID, name, username, email, contactNumber, createdAt
        FROM user ORDER BY userID DESC
    """
    )

    allUser = cursor.fetchall()
    cursor.close()
    db.close()

    return allUser

#view1User
@app.get("/user/{id}")
def view1user(id: int):
    db = dbconnect()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT userID, name, username, email, contactNumber, createdAt
        FROM user WHERE userID = %s
    """,
    (id,)
    )

    oneUser = cursor.fetchone()
    cursor.close()
    db.close()

    if not oneUser:
        raise HTTPException(404, "User not found.")

    return oneUser

#updateUser
@app.put("/user/{id}")
def updateUser(id: int, user: UserUpdate):
    db = dbconnect()
    cursor = db.cursor()

    cursor.execute(
        """
        UPDATE user SET
        name = %s,
        username = %s,
        email = %s,
        contactNumber = %s,
        WHERE userID = %s
    """,
    (
        user.name,
        user.username,
        user.email,
        user.contactNumber,
        id
    )
    )

    updatedUser = cursor.rowcount
    db.commit()
    cursor.close()
    db.close()

    if updatedUser == 0:
        raise HTTPException(404, "User not found or no changes applied")

    return { "message": "User updated successfully!"}

#deleteUser
@app.delete("/user/{id}")
def deleteUser(id: int):
    db = dbconnect()
    cursor = db.cursor()

    cursor.execute("DELETE FROM user WHERE userID = %s", (id,))

    deletedUser = cursor.rowcount

    db.commit()
    cursor.close()
    db.close()

    if deletedUser == 0:
        raise HTTPException(404, "User not found")

    return{"message": "User deletion successful!"}

#Eventfeatures

#viewEvents
@app.get("/events")
def viewEvents():
    db = dbconnect()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM events ORDER BY startTime ASC")

    viewEvents = cursor.fetchall()

    cursor.close()
    db.close()

    return viewEvents

#view1event
@app.get("/events/{id}")
def view1Event(id: int):
    db = dbconnect()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM events WHERE eventID = %s", (id,))

    viewEvent = cursor.fetchone()

    cursor.close()
    db.close()

    if not viewEvent:
        raise HTTPException(404, "Event does not exists!")

    return viewEvent

#addEvent
@app.post("/admin/event")
def add_event(event: Event):

    if event.endTime <= event.startTime:
        raise HTTPException(400, "Wrong set of time.")

    db = dbconnect()
    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO events (
            eventName,
            description,
            venue,
            eventImage,
            startTime,
            endTime,
            price,
            totalTickets,
            availableTickets,
            currentStatus
        )
    """,
    (
        event.eventName,
        event.description,
        event.venue,
        event.eventImage,
        event.startTime,
        event.endTime,
        event.price,
        event.totalTickets,
        event.totalTickets,
        event.currentStatus
    )
    )

    db.commit()

    eventID = cursor.lastrowid

    cursor.close()
    db.close()

    return{
        "message": "New Event added!",
        "eventID": eventID
    }

#updateEvent
@app.put("/admin/event/{id}")
def updateEvent(id: int, event: EventUpdate):
    if event.endTime <= event.startTime:
        raise HTTPException(400, "Wrong set of time!")


    approveStatuses = [
        "Upcoming",
        "Ongoing",
        "Ended",
        "Cancelled"
    ]

    if event.currentStatus not in approveStatuses:
        raise HTTPException(400, "Invalid event status")

    db = dbconnect()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT totalTickets, availableTickets
        FROM events
        WHERE eventID = %s
    """,
    (id,)
    )

    oldEvent = cursor.fetchone()

    if not oldEvent:
        cursor.close()
        db.close()

        raise HTTPException(400, "Event does not exists!")

    remainingTicket = (oldEvent["totalTickets"] - oldEvent["availableTickets"])

    if event.totalTickets < remainingTicket:
        cursor.close()
        db.close()

        raise HTTPException(400, "Cannot decrease total tickets anymore")

    newTicket = event.totalTickets - remainingTicket

    cursor.execute(
        """
        UPDATE events SET
            eventName = %s,
            description = %s,
            venue = %s,
            eventImage = %s,
            startTime = %s,
            endTime = %s,
            price = %s,
            totalTickets = %s,
            availableTickets = %s,
            currentStatus = %s
    """,
    (
        event.eventName,
        event.description,
        event.venue,
        event.eventImage,
        event.startTime,
        event.endTime,
        event.price,
        event.totalTickets,
        newTicket,
        event.currentStatus,
        id
        
    )
    )

    db.commit()
    cursor.close()
    db.close()

    return {
        "message": "Event successfully updated!",
        "avaliableTickets": newTicket
    }

#eventDeletion
@app.delete("/admin/events/{id}")
def deleteEvent(id: int):
    db = dbconnect()
    cursor = db.cursor()

    cursor.execute("DELETE FROM events WHERE eventID = %s", (id,))

    deletedEvent = cursor.rowcount
    db.commit()
    cursor.close()
    db.close()

    if deletedEvent == 0:
        raise HTTPException(404, "Event does not exists!")

    return { "message": "Event deletion successful!"}



#BookingFeatures
#customerbookingfeatures
#addBooking
@app.post("/bookings")
def addBookings(booking: Booking):
    db = dbconnect()
    cursor = db.cursor(dictionary=True)

    db.start_transaction()

    cursor.execute(
        """
        SELECT eventID, price, availableTickets, currentStatus, startTime
        FROM events
        WHERE eventID = %s
        FOR UPDATE
    """,
    (booking.eventID,)
    )

    bookEvent = cursor.fetchone()

    if not bookEvent:
        db.rollback()
        cursor.close()
        db.close()

        raise HTTPException(404, "Event not found")

    cursor.execute("SELECT userID FROM user WHERE userID = %s", (booking.userID,))

    bookUser = cursor.fetchone()

    if not bookUser:
        db.rollback()
        cursor.close()
        db.close()

        raise HTTPException(404, "User not found!")

    if bookEvent["currentStatus"] != "Upcoming":
        db.rollback()
        cursor.close()
        db.close()

        raise HTTPException(400, "This event is not available for booking.")

    if bookEvent["startTime"] <= datetime.now():
        db.rollback()
        cursor.close()
        db.close()

        raise HTTPException(400, "This event has already ended")

    if bookEvent["availableTickets"] < booking.quantity:
        db.rollback()
        cursor.close()
        db.close()

        raise HTTPException(400,  "Not enough available tickets")


    total_amount = Decimal(str(bookEvent["price"])) * booking.quantity

    cursor.execute(
        """
        INSERT INTO bookings (userID, eventID, quantity, totalAmount, bookStatus)
        VALUES (%s, %s, %s, %s, 'Pending')
    """,
    (
        booking.userID,
        booking.eventID,
        booking.quantity,
        total_amount
    )
    )

    bookID = cursor.lastrowid

    cursor.execute(
        """
        UPDATE events 
        SET availableTickets = availableTickets - %s
        WHERE eventID = %s
    """,
    (booking.quantity, booking.eventID)
    )

    db.commit()
    cursor.close()
    db.close()

    return{
        "message": "Booking successful! Please wait for the approval :)",
        "bookID": bookID,
        "totalAmount": str(total_amount),
        "bookStatus": "Pending"
    }

#viewbooking
@app.get("/customer/bookings/{id}")
def viewBooking(id: int):
    db = dbconnect()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT b.bookID, b.userID, b.eventID, b.quantity, b.totalAmount, b.bookStatus, b.bookedAt, e.eventName, e.venue, e.startTime, e.endTime, e.eventImage
        FROM bookings b
        INNER JOIN events e 
        ON b.eventID = e.eventID
        WHERE b.userID = %s
        ORDER BY b.bookedAt DESC        
    """,
    (id,)
    )

    viewBooking = cursor.fetchall()
    cursor.close()
    db.close()
    return viewBooking

#updateBookingqty
@app.put("/bookings/{id}")
def updateBooking(id: int, bookUpdate: BookingUpdate):
    db = dbconnect()
    cursor = db.cursor(dictionary=True)
    db.start_transaction()

    cursor.execute(
        """
        SELECT bookID, eventID, quantity, bookStatus FROM bookings
        WHERE bookID = %s
        FOR UPDATE
    """,
    (id,)
    )

    bookingUpdate = cursor.fetchone()

    if not bookingUpdate:
        db.rollback()
        cursor.close()
        db.close()

        raise HTTPException(404, "Booking not found")

    if bookingUpdate["bookStatus"] != "Pending":
        db.rollback()
        cursor.close()
        db.close()

        raise HTTPException(400, "Only pending bookings can be edited")

    cursor.execute(
        """
        SELECT availableTickets, price, currentStatus FROM events
        WHERE eventID = %s
        FOR UPDATE
    """,
    (bookingUpdate["eventID"],)
    )

    eventUpdate = cursor.fetchone()
    if not eventUpdate or eventUpdate["currentStatus"] != "Upcoming":
        db.rollback()
        cursor.close()
        db.close()

        raise HTTPException(400, "Event is not available for update")

    quantityDiff = bookUpdate.quantity - bookingUpdate["quantity"]

    if quantityDiff > eventUpdate["availableTickets"]:
        db.rollback()
        cursor.close()
        db.close()

        raise HTTPException(400, "Not enough available tickets")

    newAmount = Decimal(str(eventUpdate["price"])) * bookUpdate.quantity

    cursor.execute(
        """
        UPDATE bookings
        SET quantity = %s, totalAmount =%s
        WHERE bookID = %s    
    """
    (bookUpdate.quantity, newAmount, id)
    )

    cursor.execute(
        """
        UPDATE events
        SET availableTickets = availableTickets - %s
        WHERE eventID = %s
    """,
    (quantityDiff, bookingUpdate["eventID"])
    )

    db.commit()
    cursor.close()
    db.close()

    return{
        "message": "Booking updated successfully",
        "quantity": bookUpdate.quantity,
        "totalAmount": str(newAmount)
    }


#adminbookingfeatures
