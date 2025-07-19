import { prisma} from '../prisma/client.js';
import { Parser } from "json2csv";
import csv from "csv-parser";
import { Readable } from "stream";

export const  getSubscribers = async (req,res) => {
      try{
            const tenantId = req.user.tenantId;
            const subscribers = await prisma.subscriber.findMany({
              where: { tenantId, isDeleted: false },
              include: { lists: true },
            });
            res.json(subscribers);
      }
      catch(error){
            // console.error("Error fetching subscribers:", error);
            res.status(500).json({ message: "Error fetching subscribers:", error });
      }
  }

  export const createSubscriber = async (req,res) => {
      try {
            const { email, name } = req.body;
            const tenantId = req.user.tenantId;
        
            if (!email) {
              return res.status(400).json({ error: "Email is required" });
            }
        
            const existing = await prisma.subscriber.findFirst({
              where: { email, tenantId },
            });
        
            if (existing) {
              return res.status(409).json({ error: "Subscriber already exists" });
            }

            const subscriber = await prisma.subscriber.create({
                  data: {
                    email,
                    name,
                    tenantId,
                  },
                });
            res.status(201).json({ message: "Subscriber created", subscriber });

      }
      catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
          }
          
  }

  export const getSubscriberById = async (req, res) => {
    try {
      const { id } = req.params;
      const tenantId = req.user.tenantId;
  
      const subscriber = await prisma.subscriber.findFirst({
        where: { id, tenantId, isDeleted: false },
        include: { lists: true },
      });
  
      if (!subscriber) {
        return res.status(404).json({ error: "Subscriber not found" });
      }
  
      res.json(subscriber);
    } catch (err) {
      res.status(500).json({ error: "Error retrieving subscriber" });
    }
  };
  
  export const deleteSubscriber = async (req, res) => {
    try {
      const { id } = req.params;
      const tenantId = req.user.tenantId;
  
      const existing = await prisma.subscriber.findFirst({
        where: { id, tenantId },
      });
  
      if (!existing) {
        return res.status(404).json({ error: "Subscriber not found" });
      }
  
      await prisma.subscriber.update({
        where: { id },
        data: { isDeleted: true },
      });
  
      res.json({ message: "Subscriber deleted (soft)" });
    } catch (err) {
      res.status(500).json({ error: "Error deleting subscriber" });
    }
  };
  


export const uploadCsvSubscribers = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const results = [];

    if (!req.file) {
      return res.status(400).json({ error: "CSV file is required" });
    }

    const stream = Readable.from(req.file.buffer);
    
    stream
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", async () => {
        const created = [];

        for (const row of results) {
          const { email, name } = row;
          if (!email) continue;

          const existing = await prisma.subscriber.findFirst({
            where: { email, tenantId },
          });

          if (!existing) {
            const subscriber = await prisma.subscriber.create({
              data: { email, name, tenantId },
            });
            created.push(subscriber);
          }
        }

        res.json({
          message: `Imported ${created.length} subscribers successfully.`,
          subscribers: created,
        });
      });
  } catch (err) {
    res.status(500).json({ error: "CSV import failed", details: err });
  }
};




export const downloadSubscribersCsv = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const subscribers = await prisma.subscriber.findMany({
      where: { tenantId, isDeleted: false },
      select: {
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!subscribers.length) {
      return res.status(404).json({ error: "No subscribers found" });
    }

    const json2csvParser = new Parser({ fields: ["email", "name", "createdAt"] });
    const csv = json2csvParser.parse(subscribers);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=subscribers.csv");
    res.status(200).end(csv);
  } catch (err) {
    console.error("CSV export error:", err);
    res.status(500).json({ error: "CSV export failed" });
  }
};
