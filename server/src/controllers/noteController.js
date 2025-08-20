import prisma from '../utils/prismaClient.js';

export const createNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = await prisma.note.create({ data: { title, content, userId: req.user.id } });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getNotes = async (req, res) => {
  const notes = await prisma.note.findMany({ where: { userId: req.user.id } });
  res.json(notes);
};

export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const note = await prisma.note.update({
      where: { id: Number(id) },
      data: { title, content }
    });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.note.delete({ where: { id: Number(id) } });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
