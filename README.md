# March Cohort's Pet Adoptions

A web application that lets users manage a pet adoption facility. Made with React, DynamoDB, and Material UI.

## Features

- Users can add pets
- Users can see all available/unavailable
- Users can mark a pet as adopted
- Users can update a pets details
- Users can remove a pet from the inventory

## Pet object schema

### Minimum properties of pet object

**Table Name:** Pet

`{
    id: String,  name: string, age: number, isAdopted: boolean
  }`
