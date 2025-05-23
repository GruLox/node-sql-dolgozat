import express from "express";
import * as db from "./util/database.js";

const PORT = 8080;
const app = express();
app.use(express.json());

app.get("/books", (req, res) => {
	try {
		const books = db.getAllBooks();
		res.status(200).json(books);
	} catch (error) {
		res.status(500).json({ message: `${error}` });
	}
});

app.get("/books/:id", (req, res) => {
	try {
		const book = db.getBookById(req.params.id);
		if (!book) {
			return res.status(404).json({ message: "Book not found" });
		}
		res.status(200).json(book);
	} catch (error) {
		res.status(500).json({ message: `${error}` });
	}
});

app.post("/books", (req, res) => {
	try {
		const { title, author } = req.body;
		if (!title || !author) {
			return res.status(400).json({ message: "Title and author are required" });
		}
		const savedBook = db.createBook(title, author);
		if (savedBook.changes != 1) {
			return res.status(422).json({ message: "Unprocessable Entity" });
		}
		res.status(201).json({ id: savedBook.lastInsertRowid, title, author });
	} catch (error) {
		res.status(500).json({ message: `${error}` });
	}
});

app.put("/books/:id", (req, res) => {
	try {
		const { title, author } = req.body;
		if (!title || !author) {
			return res.status(400).json({ message: "Title and author are required" });
		}
		const id = req.params.id;
		const updatedBook = db.updateBook(id, title, author);
		if (updatedBook.changes != 1) {
			return res.status(422).json({ message: "Unprocessable Entity" });
		}
		res.status(200).json({ id, title, author });
	} catch (error) {
		res.status(500).json({ message: `${error}` });
	}
});

app.delete("/books/:id", (req, res) => {
	try {
		const deletedBook = db.deleteBook(req.params.id);
		if (deletedBook.changes != 1) {
			return res.status(422).json({ message: "Unprocessable Entity" });
		}
		res.status(200).json({ message: "Delete successful" });
	} catch (error) {
		res.status(500).json({ message: `${error}` });
	}
});

app.listen(PORT, () => console.log(`Server runs on port ${PORT}`));
