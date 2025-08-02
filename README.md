# Book Gallery

## About the Project

![Project Screenshot](demo_img/demo1.png)
*Project Screenshot*

This project is a web-based collage of books I've read. It was created using the MERN stack.

There are two different view modes, gallery view and list view. In gallery view, only the book covers are shown - more details are shown in a separate modal. In list view, book covers are shown along with additional details beside it.

![List View](demo_img/demo7.png)
*List View*

A modal is displayed when a book is clicked on, providing more details about the book - a larger image of the cover, the title, the author(s), page count, description, and a list of genres.

![Book Modal](demo_img/demo2.png)
*Book Modal*

New books can be added directly on the web interface. Data can either be manually added, or can be pulled from the Google Books API. 

![Form Panel 1](demo_img/demo3.png)
![Form Panel 2](demo_img/demo8.png)
*Form Panel*

Clicking the "Search by Title" button performs an API call to search for books based on what is entered in the "Title" field. A modal is then shown, displaying a list of books retrieved from the API. Clicking on a book will populate the form fields with the data for the selected book. 

![Modal of Retrieved Books](demo_img/demo6.png)
*Modal of Retrieved Books*

Clicking the "Search by ISBN" button opens a modal where there is the option to either scan the ISBN barcode from the book using a camera (can choose between any connected video capturing device) or manually enter the ISBN, allowing for easy retrieval of the correct edition of the book. Once the scanner finds and decodes the barcode, an API call is immediately made to the Google Books API to find the book by the ISBN. If the ISBN is manually entered, the call is made when the "Search by ISBN" button in the modal is clicked.

![ISBN Input Modal - Live Video Input](demo_img/demo15.png)
*ISBN Search Modal - Live Video Input*

![ISBN Input Modal - Manual Input](demo_img/demo16.png)
*ISBN Search Modal - Manual Input*

![Book Retrieved by ISBN Search](demo_img/demo17.png)
*Book Retrieved by ISBN Search*

A search filter allows for filtering on author and title. The ability to filtering by date read, by type (fiction, nonfiction, etc.), and by genre is also present. Sorting is also available based on date read, author name, and title.

![Searching by author and/or title](demo_img/demo4.png)
*Searching by author and/or title*

![Filtering by date read](demo_img/demo20.png)
*Filtering by date read*

![Filtering by type](demo_img/demo9.png)
*Filtering by type*

![Filtering by genre](demo_img/demo10.png)
*Filtering by genre*

![Sorting](demo_img/demo5.png)
*Sorting*

The sorting and filtering functionality is encapsulated in a collapsible sidebar, which can be closed to allow for more books to be shown on a single line.

![Modal of Retrieved Books](demo_img/demo14.png)
*Collapsed Sidebar*

In addition, there is a page that displays numerous statistics, both in terms of the total and the year to date values. Measured statistics include books read, pages read, top authors, percentage of fiction and nonfiction books read, and top genres.

![Statistics 1](demo_img/demo11.png)
![Statistics 2](demo_img/demo12.png)
![Statistics 3](demo_img/demo13.png)
*Statistics* 

The statistics can also be downloaded into an Excel document by clicking the "Export data to Excel" button in the Gallery page. The Excel document contains four sheets: Books (all book data), Statistics (total books read, pages read, fiction books read and nonfiction books read), Authors (number of books read by each author), and Genres (number of books read in each genre)

![Export](demo_img/demo18.png)
*Exporting data*
![Excel Spreadsheet](demo_img/demo19.png)
*Excel spreadsheet*

## Built With
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express JS](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Microsoft Azure](https://img.shields.io/badge/microsoft%20azure-0089D6?style=for-the-badge&logo=microsoft-azure&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

## Getting Started

### Prerequisites

+ Node.js
+ NPM

### Installation

1. Clone the project using 
```
git clone https://github.com/alicia4550/book-gallery.git
```

2. Navigate to the project's root directory.

3. Run the `install.bat` file.

4. Create an API key using the following instructions: [Using the Google Books API](https://developers.google.com/books/docs/v1/using).

5. Navigate to the `client` directory.

6. In the `run-server.bat` file, enter your API key in the following line:
```
set API={INSERT GOOGLE BOOKS API KEY HERE}
```

7. Set up a MongoDB database `gallery` with the collection `books`.

8. Replace the URI string on line 6 of `server/db.js` with the MongoDB deployment's connection string.

9. In the `run-server.bat` file, enter your database password in the following line:
```
set DB_PASSWORD={INSERT MONGODB PASSWORD HERE}
```

10. Set up an Azure Blob Storage account with a container `bookgallerycovers`.

11. In the `run-server.bat` file, enter your Azure Storage account name in the following line:
```
set AZURE_STORAGE_ACCOUNT_NAME={INSERT AZURE STORAGE ACCOUNT NAME HERE}
```

12. Create a SAS token with read access to your storage account.

13. In the `run-server.bat` file, enter your SAS token in the following line:
```
set SAS_TOKEN={INSERT AZURE STORAGE SAS TOKEN HERE}
```

14. Sign-in to Azure through the Azure CLI using the following command:
```
az login
```

### Usage

1. Navigate to the project's root directory.

2. Run the `run.bat` file.

3. Open `http://localhost:3000/` in your local browser.

## License

Distributed under the MIT License. See `LICENSE` for more information.