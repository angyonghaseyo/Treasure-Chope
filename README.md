# Treasure Chope
Treasure Chope is a platform to connect restaurants with excess food, packaged as surprise bags, to consumers seeking more diverse and affordable meal options. 

Our mission is to bridge the gap between local businesses and consumers, promoting a sustainable approach to food consumption. Through Treasure Chope, users can purchase 'surprise bags' of surplus food from local eateries that would have otherwise been thrown away, significantly reducing waste.

Our platform is intuitive and inclusive, accommodating a range of dietary needs and preferences with features such as categories.

## Motivation: Why we started Treasure Chope 
Despite having to import over 90% of food supplies, food waste is one of Singapore’s biggest waste streams — and the amount of food wasted has grown by around 20% in the last decade

Food waste is a significant national issue, with restaurants discarding surplus food daily. Simultaneously, consumers struggle to access affordable, diverse meals. Traditional methods of connecting businesses with consumers often overlook surplus food, contributing to environmental concerns and economic losses for businesses.

## How does Treasure Chope help?
With this gap in the market, we decided to venture into Treasure Chope to bridge the divide between surplus food availability and consumer access. 
This initiative helps reduce food waste while providing economic benefits to restaurants and enriching the culinary experiences of consumers.
Our platform not only reduces food waste but also supports restaurants in recuperating potential losses, fostering a more sustainable food ecosystem. This initiative aligns with global efforts to minimise environmental impact while enhancing food security for communities.

## Treasure Chope’s User Experience
On a more technical aspect, Treasure Chope prides itself on being a user-friendly platform where both users and restaurants can intuitively navigate its features. The interface is designed with simplicity in mind, ensuring that interactions are straightforward and efficient. With clear menus, responsive design, and easy-to-follow steps, users can quickly find and order their desired meals, while restaurants can effortlessly upload and manage their surplus inventory. 
This seamless interaction enhances the user experience, fostering greater engagement and satisfaction across the platform. It also effectively reduces the churn rate by ensuring that both users and restaurants enjoy a smooth and rewarding experience, encouraging continued use and loyalty.

## Features

- **Surprise Boxes**: Get a variety of delicious food at reduced prices.
- **Waste Reduction**: Help local businesses cut down on food waste.
- **Dietary Filters**: Find food that fits your dietary restrictions and preferences.

## Technology Stack

- **Frontend**: React.js, for building a responsive and interactive user interface with dynamic rendering capabilities.
- **State Management**: Redux, used to maintain a predictable and centralized application state.
- **Database**: Firebase Firestore, a NoSQL solution for real-time data storage and synchronization.
- **Authentication**: Firebase SDK, providing secure user authentication and seamless integration with Firestore.
- **File Storage**: Firebase Storage, handling efficient storage of user-generated content like images and documents.
- **Real-Time Communication**: Enabled through Firebase SDK & Firestore, ensuring immediate state updates across client devices.

### Prerequisites

- npm or Yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/angyonghaseyo/Treasure-Chope.git
   ```
2. Navigate to the project directory:
   ```sh
   cd treasure-chope
   ```
3. Install the required dependencies:
   ```sh
   npm install
   ```
   or if you prefer using Yarn:
   ```sh
   yarn
   ```

### Running the Application

Start the development server with the following command:

```sh
npm run start
```

or using Yarn:

```sh
yarn start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes.

## Live Demo

Experience Treasure Chope in action: [Live Demo](https://treasure-chope.firebaseapp.com)

## Architecture Diagram
![Treasure Chope Architecture Diagram](https://github.com/angyonghaseyo/Treasure-Chope/blob/main/public/TreasureChope_Architecture.png)
### User Interface (React Frontend):
- This is where the users interact with the application. The React frontend is responsible for rendering the UI components that include pages like Home, RegisterRestaurant, MyFoods, MyOrders, and more.
- The dynamic nature of React allows for an engaging and responsive user experience.

### API Calls:
- The frontend communicates with Firebase Firestore through API calls made using the Firebase SDK. These calls handle operations like user authentication, data retrieval, and updates.

### Real-time Updates:
- Firebase Firestore provides real-time database updates to the React frontend. This allows for the immediate reflection of changes in the application state across all clients without the need for manual refresh.

### Firebase Firestore (Database):
- Firestore acts as the database layer for Treasure Chope. It stores and manages all the data, including user profiles, order details, restaurant information, and more.
- The NoSQL structure of Firestore allows for flexible data models, which can be easily adapted to the varying needs of the application.

### Firebase SDK:
- This SDK integrates various Firebase services like authentication and file storage with the application.
- It provides a set of tools for interacting with Firebase Firestore, handling file uploads to Firebase Storage, and managing user authentication seamlessly.



