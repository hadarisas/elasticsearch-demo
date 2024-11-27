import express from "express";
import { Client } from "@elastic/elasticsearch";
import cors from "cors";
import dotenv from "dotenv";

//initialize express app
const app = express();

dotenv.config();

//use cors to allow cross-origin requests
app.use(cors());

//use express.json to parse JSON within requests
app.use(express.json());

// Initialize Elasticsearch client
//In Case you have multiple nodes, you need to specify all nodes:
const client = new Client({
  //node: "http://localhost:9200",
  node: "http://elasticsearch:9200",
});

// Initialize sample data
const initializeData = async () => {
  try {
    // Delete existing index if it exists
    const indexExists = await client.indices.exists({ index: "products" });
    if (indexExists) {
      await client.indices.delete({ index: "products" });
      console.log("Deleted existing products index");
    }

    // Create new index with proper text analysis
    await client.indices.create({
      index: "products",
      body: {
        settings: {
          analysis: {
            analyzer: {
              custom_analyzer: {
                type: "custom",
                tokenizer: "standard",
                filter: ["lowercase", "trim"],
              },
            },
          },
        },
        mappings: {
          properties: {
            name: {
              type: "text",
              analyzer: "custom_analyzer",
              fields: {
                keyword: {
                  type: "keyword",
                },
              },
            },
            description: {
              type: "text",
              analyzer: "custom_analyzer",
            },
            price: { type: "float" },
          },
        },
      },
    });
    console.log("Products index created successfully");

    // Add sample data
    const sampleData = [
      {
        name: "iPhone 13",
        description: "iPhone 13 Apple smartphone",
        price: 999,
      },
      {
        name: "Samsung Galaxy S21",
        description: "Android flagship phone",
        price: 899,
      },
      {
        name: "iPhone 14",
        description: "iPhone 14 Apple smartphone",
        price: 999,
      },
      {
        name: "iPhone 15",
        description: "iPhone 15 Apple smartphone",
        price: 999,
      },
      {
        name: "Samsung Galaxy S21",
        description: "Android flagship phone",
        price: 899,
      },
      { name: "MacBook Pro", description: "Professional laptop", price: 1299 },
      {
        name: "Sony WH-1000XM5",
        description: "Noise-canceling headphones",
        price: 399,
      },
      {
        name: "Dell XPS 13",
        description: "High-performance ultrabook",
        price: 1199,
      },
      {
        name: "Apple Watch Series 8",
        description: "Smartwatch with health tracking",
        price: 399,
      },
      {
        name: "Nintendo Switch OLED",
        description: "Hybrid gaming console",
        price: 349,
      },
      {
        name: "Amazon Echo Dot",
        description: "Smart home assistant",
        price: 49,
      },
      {
        name: "Canon EOS R6",
        description: "Full-frame mirrorless camera",
        price: 2499,
      },
      {
        name: "Samsung QLED TV",
        description: "4K Ultra HD Smart TV",
        price: 1299,
      },
      {
        name: "Google Pixel 7",
        description: "Google's latest smartphone",
        price: 599,
      },
      {
        name: "Sony PlayStation 5",
        description: "Next-gen gaming console",
        price: 499,
      },
      {
        name: "Xbox Series X",
        description: "Microsoft's gaming powerhouse",
        price: 499,
      },
      {
        name: "Razer Blade 15",
        description: "Gaming laptop with RTX graphics",
        price: 1799,
      },
      {
        name: "DJI Mini 3 Pro",
        description: "Compact drone with 4K camera",
        price: 759,
      },
      {
        name: "Fitbit Charge 5",
        description: "Fitness and health tracker",
        price: 129,
      },
      {
        name: "Logitech MX Master 3",
        description: "Ergonomic wireless mouse",
        price: 99,
      },
      {
        name: "HyperX Cloud II",
        description: "Gaming headset with surround sound",
        price: 79,
      },
      {
        name: "Lenovo ThinkPad X1",
        description: "Business-class ultrabook",
        price: 1399,
      },
      {
        name: "Google Nest Hub",
        description: "Smart display for home automation",
        price: 129,
      },
      {
        name: "Bose QuietComfort Earbuds",
        description: "Premium noise-canceling earbuds",
        price: 279,
      },
      {
        name: "Apple AirPods Pro",
        description: "True wireless earbuds",
        price: 249,
      },
      {
        name: "Samsung Galaxy Tab S8",
        description: "High-performance Android tablet",
        price: 799,
      },
      {
        name: "ASUS ROG Strix",
        description: "Gaming laptop with RGB lighting",
        price: 1999,
      },
      {
        name: "HP Spectre x360",
        description: "Convertible touchscreen laptop",
        price: 1599,
      },
      {
        name: "Kindle Paperwhite",
        description: "E-reader with adjustable lighting",
        price: 139,
      },
      {
        name: "Corsair K95 RGB",
        description: "Mechanical gaming keyboard",
        price: 199,
      },
      {
        name: "GoPro HERO11",
        description: "Action camera with 5.3K video",
        price: 499,
      },
      {
        name: "Sonos One",
        description: "Smart speaker with Alexa",
        price: 199,
      },
      {
        name: "Oculus Quest 2",
        description: "All-in-one VR headset",
        price: 399,
      },
      {
        name: "Samsung SSD 970 EVO",
        description: "High-speed NVMe SSD",
        price: 139,
      },
      {
        name: "Apple Mac Mini",
        description: "Compact desktop computer",
        price: 699,
      },
      {
        name: "Dyson V15 Detect",
        description: "Cordless vacuum cleaner",
        price: 749,
      },
      { name: "Roku Ultra", description: "4K HDR streaming device", price: 99 },
      {
        name: "Garmin Fenix 7",
        description: "Premium multisport GPS watch",
        price: 699,
      },
      {
        name: "Acer Predator Helios 300",
        description: "Gaming laptop with powerful specs",
        price: 1499,
      },
      {
        name: "Yamaha YAS-209",
        description: "Soundbar with wireless subwoofer",
        price: 349,
      },
      {
        name: "Seagate Backup Plus",
        description: "Portable external hard drive",
        price: 79,
      },
      {
        name: "SteelSeries Arctis 7",
        description: "Wireless gaming headset",
        price: 159,
      },
      {
        name: "Panasonic Lumix GH5",
        description: "Mirrorless camera for video creators",
        price: 1699,
      },
      {
        name: "LG UltraGear 27GN950",
        description: "4K UHD gaming monitor",
        price: 799,
      },
      {
        name: "Apple Magic Keyboard",
        description: "Wireless keyboard for Mac",
        price: 99,
      },
      {
        name: "Microsoft Surface Pro 9",
        description: "Versatile 2-in-1 laptop",
        price: 1099,
      },
      {
        name: "Anker PowerCore III",
        description: "Portable charger with high capacity",
        price: 49,
      },
      {
        name: "Ring Video Doorbell 4",
        description: "Smart doorbell with camera",
        price: 199,
      },
      {
        name: "Alienware Aurora R15",
        description: "High-performance gaming desktop",
        price: 2499,
      },
      {
        name: "Nvidia GeForce RTX 4090",
        description: "Top-tier graphics card",
        price: 1599,
      },
      {
        name: "Samsung Galaxy Watch 6",
        description: "Smartwatch with fitness tracking",
        price: 329,
      },
      {
        name: "WD My Passport",
        description: "Portable external hard drive",
        price: 99,
      },
      {
        name: "Herman Miller Aeron",
        description: "Ergonomic office chair",
        price: 1499,
      },
      {
        name: "Sennheiser Momentum 4",
        description: "Premium over-ear headphones",
        price: 349,
      },
      {
        name: "Philips Hue Starter Kit",
        description: "Smart lighting system",
        price: 199,
      },
      {
        name: "ASUS TUF Gaming B550M",
        description: "Motherboard for gamers",
        price: 179,
      },
      {
        name: "Samsung T7 Portable SSD",
        description: "External SSD with fast speeds",
        price: 109,
      },
      {
        name: "Sony A7 IV",
        description: "Full-frame mirrorless camera",
        price: 2499,
      },
      {
        name: "Pebble Smartwatch",
        description: "Affordable smartwatch option",
        price: 99,
      },
      { name: "Eero 6", description: "Mesh Wi-Fi system", price: 299 },
      {
        name: "Corsair Vengeance RGB Pro",
        description: "High-performance gaming RAM",
        price: 159,
      },
      {
        name: "Raspberry Pi 4",
        description: "Versatile mini-computer",
        price: 49,
      },
      {
        name: "TP-Link Archer AX6000",
        description: "Wi-Fi 6 router",
        price: 299,
      },
      {
        name: "Theragun Elite",
        description: "Percussive therapy massage gun",
        price: 399,
      },
      {
        name: "Dell Ultrasharp 32",
        description: "Professional 4K monitor",
        price: 1199,
      },
      {
        name: "ASUS ZenBook Duo",
        description: "Laptop with dual screens",
        price: 1699,
      },
      {
        name: "Beats Studio Buds",
        description: "Wireless noise-canceling earbuds",
        price: 149,
      },
      {
        name: "Shure SM7B",
        description: "Professional podcast microphone",
        price: 399,
      },
      {
        name: "Apple iPad Pro",
        description: "High-end tablet for professionals",
        price: 1099,
      },
      {
        name: "Logitech C920",
        description: "HD webcam for video calls",
        price: 79,
      },
      {
        name: "Bose SoundLink Revolve",
        description: "Portable Bluetooth speaker",
        price: 199,
      },
      {
        name: "ASUS ROG Phone 6",
        description: "Gaming smartphone",
        price: 999,
      },
      {
        name: "Canon PIXMA TS9120",
        description: "All-in-one color printer",
        price: 179,
      },
      {
        name: "Samsung Galaxy Z Fold 4",
        description: "Folding smartphone",
        price: 1799,
      },
      {
        name: "Tile Mate",
        description: "Bluetooth tracker for items",
        price: 25,
      },
      {
        name: "Logitech G Pro Wireless",
        description: "Gaming mouse with precision",
        price: 129,
      },
      {
        name: "Sony Xperia 1 IV",
        description: "Smartphone with 4K display",
        price: 1199,
      },
      {
        name: "Netgear Nighthawk AX12",
        description: "High-performance Wi-Fi router",
        price: 499,
      },
      {
        name: "Garmin Edge 530",
        description: "Cycling GPS computer",
        price: 299,
      },
      {
        name: "Jabra Elite 85t",
        description: "Wireless earbuds with ANC",
        price: 229,
      },
      {
        name: "MSI GeForce GTX 1660",
        description: "Affordable gaming GPU",
        price: 249,
      },
      {
        name: "Huawei MateBook X Pro",
        description: "Premium ultrabook",
        price: 1499,
      },
      {
        name: "SanDisk Extreme Pro",
        description: "Fast microSD card for cameras",
        price: 59,
      },
      {
        name: "Apple TV 4K",
        description: "Streaming device with Dolby Vision",
        price: 179,
      },
    ];

    for (const item of sampleData) {
      await client.index({
        index: "products",
        body: item,
      });
      console.log(`${item.name} added to the index Products successfully`);
    }

    // Refresh the index to ensure all documents are available
    await client.indices.refresh({ index: "products" });
    console.log("Data initialization completed");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};

//This endpoint is used to search for products in the products index
//q is the search query
//page is the page number (default is 1)
//limit is the number of products per page (default is 5)
//req: express.Request, res: express.Response
app.get("/api/search", async (req, res) => {
  const { q, page = 1, limit = 5 } = req.query;

  try {
    // First, try exact search with pagination
    const result = await client.search({
      // we need to specify the index where we want to search in
      index: "products",
      body: {
        query: {
          //we use 'match' to search for exact matches for the search query in the name field
          match: { name: q },
        },
        from: (page - 1) * limit,
        size: limit,
      },
    });

    //The total number of documents that match the search query (we'll use it in Frontend for pagination purposes)

    const totalExact = result.hits.total.value;

    // If no exact matches, try fuzzy search (fuzzy search works better with misspelled words)
    if (totalExact === 0) {
      const fuzzyResult = await client.search({
        index: "products",
        body: {
          query: {
            //we use 'fuzzy' to search for similar words to the search query in the name field (fuzzy search works better with misspelled words )
            fuzzy: { name: { value: q, fuzziness: "AUTO" } },
          },
          from: (page - 1) * limit,
          size: limit,
        },
      });

      const totalFuzzy = fuzzyResult.hits.total.value;
      // res.json is an express.js method that sends a JSON response to the client
      res.json({
        exact: false,
        hits: fuzzyResult.hits.hits,
        suggestion:
          fuzzyResult.hits.hits.length > 0
            ? fuzzyResult.hits.hits[0]._source.name
            : null,
        total: totalFuzzy,
        page: parseInt(page),
        totalPages: Math.ceil(totalFuzzy / parseInt(limit)),
      });
    } else {
      // res.json is an express.js method that sends a JSON response to the client

      res.json({
        exact: true,
        hits: result.hits.hits,
        suggestion: null,
        total: totalExact,
        page: parseInt(page),
        totalPages: Math.ceil(totalExact / parseInt(limit)),
      });
    }
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// The health check will automatically use the correct service name.
// The health check endpoint will verify the connection to Elasticsearch
// and return its cluster health status.
app.get("/health", async (req, res) => {
  try {
    const health = await client.cluster.health();
    res.json({ status: "healthy", elasticsearch: health });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "unhealthy",
      message: "Failed to connect to Elasticsearch",
      error: error.message,
    });
  }
});

//set the port for the server to listen on
const PORT = process.env.PORT || 3001;

//start the express js server and initialize the data (if the index doesn't exist it will be created and sample data will be added to it)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeData();
});
