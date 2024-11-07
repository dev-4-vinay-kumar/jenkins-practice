import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { createRecord } from "../util/base";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }
    const user = await createRecord('user',prisma,{
        name:name
    })
    
    res.status(201).json(user);
};