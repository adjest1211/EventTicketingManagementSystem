import mysql.connector

def dbconnect():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="ticket_event"
    )