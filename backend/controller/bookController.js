const Book = require('../models/Book');

//@desc create a new book
//@route POST/api/books
//access Private

const createBook = async (req, res) => {
    try{
        const { title, author, subtitle, chapters } = req.body;

        if(!title || !author){
            return res.status(400).json({message: "Title and author are required"});
        }

        const book = await Book.create({
            userId: req.user._id,
            title,
            author,
            subtitle,
            chapters,
        });
        res.status(201).json({book});
    }
    catch(error){
        res.status(500).json({message: "server error"});
    }
};

//@desc get all books for a user
//@route GET/api/books
//access Private
const getBooks = async (req, res) => {
    try{
        const books = await Book.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ books });
    }
    catch(error){
        res.status(500).json({message: "server error"});
    }
};

//@desc get a single book by id
//@route GET/api/books/:id
//access Private
const getBookById = async (req, res) => {
    try{
        const book = await Book.findById(req.params.id);
        if(!book){
            return res.status(404).json({message: "Book not found"});
        }

        if(book.userId.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "Not authorized"});
        }
        res.status(200).json({book});
    }
    catch(error){
        res.status(500).json({message: "server error"});
    }
};

//@desc update a book
//@route PUT/api/books/:id
//access private
const updateBook = async (req, res) => {
    try{
        const book = await Book.findById(req.params.id);

        if(!book){
            return res.status(404).json({message: "Book not found"});
        }
        if(book.userId.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "Not authorized"});
        }
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
        });
        res.status(200).json({updatedBook});
    }
    catch(error){
        res.status(500).json({message: "server error"});
    }
};

//@desc delete a book
//@route DELETE/api/books/:id
//access private
const deleteBook = async (req, res) => {
    try{
        const book = await Book.findById(req.params.id);
        if(!book){
            return res.status(404).json({message: "Book not found"});
        }
        if(book.userId.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "Not authorized"});
        }
        await Book.deleteOne({_id: req.params.id});
        res.status(200).json({message: "Book deleted"});
    }
    catch(error){
        res.status(500).json({message: "server error"});
    }
};

//@desc update a book's cover image
//@route PUT/api/books/cover/:id
//access private
const updateBookCover = async (req, res) => {
    try{
        const book = await Book.findById(req.params.id);
        if(!book){
            return res.status(404).json({message: "Book not found"});
        }
        if(book.userId.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "Not authorized"});
        }
        if(req.file){
            const filePath = req.file.path.replace(/\\/g, '/');
            book.coverImage = filePath.startsWith('/') ? filePath : `/${filePath}`;
        }
        else{
            return res.status(400).json({message: "No file uploaded"});
        }
        const updatedBook = await book.save();
        res.status(200).json({updatedBook});
    }
    catch(error){
        res.status(500).json({message: "server error"});
    }
};

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    updateBookCover,
};