# Sustainable Cooking


A complete <a href="https://github.com/gratzerl/Perry/blob/main/doc/Documentation.pdf">documentation</a> and <a href="https://github.com/gratzerl/Perry/blob/main/doc/Presentation.pdf">presentation</a> of this project can be found in the `doc` folder.

The idea of project "Perry" is to reduce food waste by suggesting recipes on the basis of food pictures. The user can take pictures of all available ingredients (or ingredients which are about to expire) upload them and get recipe suggestions based on dietary preferences. The project also includes a how-to bot which offers information on different ingredients and their ways of preparation and storage.


## Application structure
This application uses webscrapers to provide data for the chatbot (QnA-Maker) and to store recipes in the database. 
Azure Functions are used as an API for communication between the web application and the features.
The backend was implemented in .NET Core 3, since Azure Functions do not yet support .NET 5 and otherwise there would have been compatibility problems between the different versions.

<div align="center">
  <image src="https://user-images.githubusercontent.com/32510229/199760282-c82cba1f-f733-4437-b2c4-7201745f71cf.png" />
</div>

## Recipe Suggester
First the user needs to upload images of their ingredients. All identified ingredients are listed and the user can choose which should be included in the recipe. In case no images are availabe, there is also an overview to select the ingredients from.

<div align="center">
  <image src="https://user-images.githubusercontent.com/32510229/199757784-388e7cf8-a7ab-4432-a830-bcaed00a0f40.png" />
</div>

In the next step, the user can state preferences regarding the food stil, dietary preferences, and the difficulty of the recipe.

<div align="center">
  <image src="https://user-images.githubusercontent.com/32510229/199757954-13e565be-78d6-492f-9ce2-4d5b93fdad58.png" />
</div>

The suggestions show the title and a short description of the recipe and is directly linked to the original recipe.
<div align="center">
  <image src="https://user-images.githubusercontent.com/32510229/199758018-b884187d-2f7d-4a08-9af8-bb1be962589c.png" />
</div>

## How-To Chatbot
The chatbot uses scraped information of a recipe website in addition to a basic knowledge database with ChitChat function provided by the Microsoft QnA-Maker
<div align="center">
  <image src="https://user-images.githubusercontent.com/32510229/199758285-4b4c070e-f9e8-4654-bb44-98958e8c4adc.png" />
</div>
