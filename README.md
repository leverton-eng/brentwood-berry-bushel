# Brentwood Berry Bushel

Build a responsive, mobile-friendly web application called Brentwood U-Pick Connect. The purpose of the application is to provide a centralized source of information that helps visitors discover and plan visits to participating U-pick farms in Brentwood, California.

The application should feel welcoming, outdoorsy, modern, and easy to navigate. Use a clean agricultural/farm-inspired design with warm natural colors, clear typography, cards, icons, and simple navigation. Prioritize mobile usability while also making the desktop version look polished.

User Roles

The application should support three user roles:

Visitor – browses farms and plans visits.

Farmer – manages information for their farm.

Administrator – manages farms, events, users, and outdated content.

Visitor Features

Create the following visitor-facing features:

Home Page

Introduction to Brentwood U-Pick Connect

Search bar

Featured farms

Seasonal produce section

Upcoming events

Quick links to browse farms, harvest information, and visit-planning resources

Farm Directory

Display participating farms as cards

Include farm name, image, location, short description, operating status, and available produce

Allow users to search and filter farms by produce

Farm Profile

Farm name and description/history

Address/location

Contact information

Operating hours

Current open/closed status

Produce available

Harvest/season information

Visitor guidance and preparation information

Upcoming farm events

Link to map/directions

Interactive Farm Map

Display participating farms geographically

Selecting a farm should provide basic information and a link to its farm profile

Harvest Calendar

Show common produce and approximate harvest/availability periods

Allow visitors to identify what may be available during different times of the season

Visit Planning

Visitor preparation guide

Allow visitors to save/bookmark farms

Allow visitors to create and update a planned farm visit

Display relevant information needed before visiting

Events

Centralized page showing upcoming farm and community events

Each event should display its name, date, location, description, and associated farm when applicable

Farmer Features

Create a farmer dashboard where an authenticated farmer can:

Update their farm profile

Update produce and harvest availability

Update operating hours and farm status

Add or update farm events

See when information was last updated

Administrator Features

Create an administrator dashboard that allows an administrator to:

Manage participating farms

Manage produce and harvest information

Manage events

Manage users/content

Review and correct inaccurate or outdated information

View basic application usage/reporting information

AI Chatbot

Include a simple chatbot interface that can help visitors find information already available within the application. It should be designed to answer questions about:

Participating farms

Produce availability

Harvest seasons

Farm locations

Operating information

Visit preparation

If information is unavailable, the chatbot should clearly state that rather than inventing an answer. Time-sensitive farm information should indicate when it was last updated.

Data

Create realistic sample/mock data for several Brentwood U-pick farms so the application can be demonstrated without requiring all real farm data immediately.

Include sample:

Farms

Produce

Harvest seasons

Operating hours

Events

Visitor guidance

User roles

Clearly structure the data so the mock information can later be replaced with verified farm information.

Design Requirements

The application should be:

Responsive and mobile-friendly

Simple and intuitive for visitors

Accessible and easy to read

Visually consistent

Designed around cards and clear information hierarchy

Suitable for users who may be accessing it while traveling or planning a farm visit

Use a warm California farm aesthetic rather than a corporate or highly technical appearance. The interface should feel friendly, local, fresh, and community-oriented.

MVP Priority

Prioritize creating a working MVP rather than overengineering every feature.

The highest-priority working features are:

Home page

Farm directory

Farm profiles

Search/filter by produce

Harvest calendar

Farm map

Events

Visit-planning information

Farmer dashboard

Administrator dashboard

Create the application structure and navigation first, then implement these features with realistic sample data. Advanced functionality such as AI responses, analytics, authentication, and social sharing can initially be represented with functional prototypes or clearly structured interfaces if full implementation requires additional services.

Do not invent factual information about real Brentwood farms and present it as verified. Any demonstration data that has not been verified should be clearly treated as sample data.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ad1faddc-5f4a-59e3-9ce8-101df268886b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
