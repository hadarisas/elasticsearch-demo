import express from "express";
import { Client } from "@elastic/elasticsearch";
import cors from "cors";
import dotenv from "dotenv";

//initialize express app
const app = express();

//load environment variables
dotenv.config();

//use cors to allow cross-origin requests
app.use(cors());

//use express.json to parse JSON within requests
app.use(express.json());

// Initialize Elasticsearch client
//In Case you have multiple nodes, you need to specify all nodes:
const client = new Client({
  node: "http://localhost:9200",
  //node: "http://elasticsearch:9200",
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
            brand: { type: "keyword" },
            category: { type: "keyword" },
            specifications: {
              type: "nested",
              properties: {
                name: { type: "keyword" },
                value: { type: "keyword" },
              },
            },
            images: {
              type: "nested",
              properties: {
                url: { type: "keyword" },
                alt: { type: "text" },
              },
            },
            stock: { type: "integer" },
            rating: { type: "float" },
            reviews_count: { type: "integer" },
            features: { type: "keyword" },
            warranty: { type: "keyword" },
            shipping_info: {
              type: "object",
              properties: {
                weight: { type: "float" },
                dimensions: { type: "keyword" },
                free_shipping: { type: "boolean" },
              },
            },
          },
        },
      },
    });
    console.log("Products index created successfully");

    // Add sample data
    const sampleData = [
      {
        name: "iPhone 13",
        description:
          "Apple smartphone with advanced features and A15 Bionic chip.",
        price: 999,
        brand: "Apple",
        category: "Smartphones",
        specifications: [
          { name: "Screen Size", value: "6.1 inches" },
          { name: "Storage", value: "128GB" },
          { name: "RAM", value: "4GB" },
          { name: "Processor", value: "A15 Bionic" },
        ],
        images: [
          {
            url: "https://uno.ma/pub/media/catalog/product/cache/a568d8357d8cb974ae9fd3a01ae20b42/l/d/ld0005930188_1.jpeg",
            alt: "iPhone 13 Front View",
          },
        ],
        stock: 50,
        rating: 4.5,
        reviews_count: 1250,
        features: [
          "5G Capable",
          "Face ID",
          "Ceramic Shield",
          "Pro camera system",
        ],
        warranty: "1 Year Limited Warranty",
        shipping_info: { weight: 0.174, dimensions: "146.7 x 71.5 x 7.65 mm" },
      },
      {
        name: "Samsung Galaxy S21",
        description: "Android flagship phone with Exynos 2100 processor.",
        price: 799,
        brand: "Samsung",
        category: "Smartphones",
        specifications: [
          { name: "Screen Size", value: "6.2 inches" },
          { name: "Storage", value: "128GB" },
          { name: "RAM", value: "8GB" },
        ],
        images: [
          {
            url: "https://www.districomputer.ma/wp-content/uploads/2023/11/smartphone-samsung-galaxy-s21-5g-dual-sim-1.jpg",
            alt: "Samsung Galaxy S21 Front View",
          },
        ],
        stock: 80,
        rating: 4.6,
        reviews_count: 2100,
        features: ["5G Capable", "Wireless PowerShare", "Pro-grade Camera"],
      },
      {
        name: "Sony WH-1000XM5",
        description: "Noise-canceling headphones with premium sound quality.",
        price: 399,
        brand: "Sony",
        category: "Headphones",
        specifications: [
          { name: "Battery Life", value: "30 hours" },
          { name: "Connectivity", value: "Bluetooth 5.2" },
        ],
        images: [
          {
            url: "https://www.racunalniske-novice.com/wp-content/uploads/2024/07/Test-Sony-WH-1000XM5-review-2-1024x768.jpg",
            alt: "Sony WH-1000XM5 Front View",
          },
        ],
        stock: 70,
        rating: 4.7,
        reviews_count: 1800,
        features: ["Noise Cancellation", "Voice Assistant Integration"],
      },
      {
        name: "MacBook Pro 16-inch",
        description: "Apple's high-performance laptop for professionals.",
        price: 2499,
        brand: "Apple",
        category: "Laptops",
        specifications: [
          { name: "Screen Size", value: "16 inches" },
          { name: "Processor", value: "M2 Max" },
        ],
        images: [
          {
            url: "https://www.cnet.com/a/img/resize/2fc142030a4ba7a60085207a6fa28fc5df37bc71/hub/2021/10/22/c94c8e08-3a47-45c4-9ec3-e512ae5f429e/img-6368.jpg",
            alt: "MacBook Pro 16-inch Front View",
          },
        ],
        stock: 30,
        rating: 4.8,
        reviews_count: 850,
        features: ["Liquid Retina Display", "Studio-quality mics"],
      },
      {
        name: "Dell XPS 13",
        description: "Compact and powerful laptop for everyday use.",
        price: 1399,
        brand: "Dell",
        category: "Laptops",
        specifications: [
          { name: "Screen Size", value: "13.4 inches" },
          { name: "Processor", value: "Intel i7" },
        ],
        images: [
          {
            url: "https://osaka.ma/wp-content/uploads/2024/04/DELLXPS13-2.jpg",
            alt: "Dell XPS 13 Laptop",
          },
        ],
        stock: 40,
        rating: 4.6,
        reviews_count: 740,
        features: ["InfinityEdge Display", "Compact Design"],
      },
      {
        name: "Bose QuietComfort Earbuds II",
        description: "Wireless earbuds with top-tier noise cancellation.",
        price: 299,
        brand: "Bose",
        category: "Earbuds",
        specifications: [
          { name: "Battery Life", value: "24 hours" },
          { name: "Connectivity", value: "Bluetooth" },
        ],
        images: [
          {
            url: "https://i.rtings.com/assets/products/AQze2J9H/bose-quietcomfort-earbuds-ii-truly-wireless/design-medium.jpg",
            alt: "Bose QuietComfort Earbuds II",
          },
        ],
        stock: 60,
        rating: 4.7,
        reviews_count: 1400,
        features: ["Noise Cancellation", "Custom Fit Tips"],
      },
      {
        name: "Logitech MX Master 3",
        description: "Advanced wireless mouse with ergonomic design.",
        price: 99,
        brand: "Logitech",
        category: "Accessories",
        specifications: [
          { name: "Battery Life", value: "70 days" },
          { name: "Connectivity", value: "Bluetooth, USB" },
        ],
        images: [
          {
            url: "https://i.rtings.com/assets/products/UPOdtAiR/logitech-mx-master-3/design-large.jpg",
            alt: "Logitech MX Master 3 Mouse",
          },
        ],
        stock: 150,
        rating: 4.8,
        reviews_count: 3200,
        features: ["Fast Scrolling", "Multi-device Control"],
      },
      {
        name: "Amazon Echo Dot (5th Gen)",
        description: "Compact smart speaker with Alexa voice assistant.",
        price: 49,
        brand: "Amazon",
        category: "Smart Devices",
        specifications: [{ name: "Connectivity", value: "WiFi, Bluetooth" }],
        images: [
          {
            url: "https://images-cdn.ubuy.co.in/633af97e94e829701903fde9-all-new-echo-dot-5th-gen-2022-release.jpg",
            alt: "Amazon Echo Dot (5th Gen)",
          },
        ],
        stock: 500,
        rating: 4.5,
        reviews_count: 9500,
        features: ["Smart Home Control", "Music Streaming"],
      },
      {
        name: "iPhone 14 Pro Max",
        description: "Apple's flagship smartphone with Pro features.",
        price: 1199,
        brand: "Apple",
        category: "Smartphones",
        specifications: [
          { name: "Screen Size", value: "6.7 inches" },
          { name: "Storage", value: "256GB" },
          { name: "RAM", value: "6GB" },
          { name: "Processor", value: "A16 Bionic" },
        ],
        images: [
          {
            url: "https://mediazone.ma/uploads/images/products/13400/13400-8oY3CAfm.webp",
            alt: "iPhone 14 Pro Max Front View",
          },
        ],
        stock: 40,
        rating: 4.7,
        reviews_count: 1350,
        features: ["Always-On Display", "Dynamic Island", "Pro Camera System"],
      },
      {
        name: "MacBook Air M2",
        description: "Apple's thin and light laptop with M2 chip.",
        price: 999,
        brand: "Apple",
        category: "Laptops",
        specifications: [
          { name: "Screen Size", value: "13.6 inches" },
          { name: "Processor", value: "M2" },
          { name: "Storage", value: "256GB SSD" },
          { name: "RAM", value: "8GB" },
        ],
        images: [
          {
            url: "https://techcrunch.com/wp-content/uploads/2022/07/CMC_1580.jpg",
            alt: "MacBook Air M2 Front View",
          },
        ],
        stock: 60,
        rating: 4.9,
        reviews_count: 1800,
        features: [
          "Liquid Retina Display",
          "All-day Battery Life",
          "Silent Design",
        ],
      },
      {
        name: "Apple Watch Series 8",
        description: "Smartwatch with health monitoring and fitness tracking.",
        price: 399,
        brand: "Apple",
        category: "Wearables",
        specifications: [
          { name: "Screen Size", value: "45mm" },
          { name: "Connectivity", value: "Bluetooth, Wi-Fi" },
          { name: "Battery Life", value: "18 hours" },
        ],
        images: [
          {
            url: "https://www.apple.com/newsroom/images/product/watch/standard/Apple-Watch-SE-8up-hero-220907_big.jpg.large.jpg",
            alt: "Apple Watch Series 8",
          },
        ],
        stock: 100,
        rating: 4.6,
        reviews_count: 2400,
        features: ["Temperature Sensor", "Crash Detection", "ECG App"],
      },
      {
        name: "Samsung Galaxy Z Fold 4",
        description: "Foldable phone with a versatile display.",
        price: 1799,
        brand: "Samsung",
        category: "Smartphones",
        specifications: [
          { name: "Screen Size", value: "7.6 inches (folded 6.2 inches)" },
          { name: "Storage", value: "512GB" },
          { name: "RAM", value: "12GB" },
          { name: "Processor", value: "Snapdragon 8+ Gen 1" },
        ],
        images: [
          {
            url: "https://imageio.forbes.com/specials-images/imageserve/631822a69a253fdf6ab586d8/1-Q4-KV-MO-Graygreen-notext/960x0.jpg",
            alt: "Samsung Galaxy Z Fold 4 Front View",
          },
        ],
        stock: 20,
        rating: 4.5,
        reviews_count: 1100,
        features: ["Foldable Design", "120Hz AMOLED Display", "Multi-tasking"],
      },
      {
        name: "Samsung Galaxy Watch 5",
        description: "Premium smartwatch with advanced health tracking.",
        price: 329,
        brand: "Samsung",
        category: "Wearables",
        specifications: [
          { name: "Screen Size", value: "44mm" },
          { name: "Connectivity", value: "Bluetooth, Wi-Fi" },
          { name: "Battery Life", value: "40 hours" },
        ],
        images: [
          {
            url: "https://www.zdnet.fr/wp-content/uploads/zdnet/2024/02/galaxy-watch-5-pro-hiking-1.jpg",
            alt: "Samsung Galaxy Watch 5",
          },
        ],
        stock: 80,
        rating: 4.7,
        reviews_count: 2500,
        features: ["Body Composition", "Advanced Sleep Tracking"],
      },
      {
        name: "Sony WF-1000XM4",
        description: "Wireless earbuds with exceptional sound quality.",
        price: 279,
        brand: "Sony",
        category: "Earbuds",
        specifications: [
          { name: "Battery Life", value: "36 hours" },
          { name: "Noise Cancellation", value: "Industry-leading" },
        ],
        images: [
          {
            url: "https://industries.ma/wp-content/uploads/2021/06/sony-wf-1000xm4-copie.jpg",
            alt: "Sony WF-1000XM4 Earbuds",
          },
        ],
        stock: 50,
        rating: 4.8,
        reviews_count: 2100,
        features: ["Customizable Fit", "Hi-Res Audio Support"],
      },
      {
        name: "Sony Alpha 7 IV",
        description: "Professional mirrorless camera with 4K video recording.",
        price: 2499,
        brand: "Sony",
        category: "Cameras",
        specifications: [
          { name: "Resolution", value: "33MP" },
          { name: "Lens Mount", value: "Sony E-mount" },
          { name: "Video", value: "4K 60fps" },
        ],
        images: [
          {
            url: "https://cdn.lesnumeriques.com/optim/product/56/56661/55aecd8d-alpha-7-iv-a7-iv__1200_630__overflow.jpeg",
            alt: "Sony Alpha 7 IV Camera",
          },
        ],
        stock: 25,
        rating: 4.9,
        reviews_count: 320,
        features: ["Real-Time Tracking", "Advanced Autofocus"],
      },
      {
        name: "Dell Alienware m15 R7",
        description: "Gaming laptop with cutting-edge performance.",
        price: 1999,
        brand: "Dell",
        category: "Laptops",
        specifications: [
          { name: "Processor", value: "Intel i9" },
          { name: "GPU", value: "NVIDIA RTX 3070" },
          { name: "Storage", value: "1TB SSD" },
        ],
        images: [
          {
            url: "https://i.dell.com/sites/csimages/Video_Imagery/all/alienware-m15-r7-thumbnail-1280x720.jpg",
            alt: "Dell Alienware m15 R7 Laptop",
          },
        ],
        stock: 15,
        rating: 4.7,
        reviews_count: 450,
        features: ["High Refresh Rate Display", "Advanced Cooling"],
      },
      {
        name: "Amazon Kindle Paperwhite",
        description:
          "E-reader with high-resolution display and waterproof design.",
        price: 139,
        brand: "Amazon",
        category: "E-readers",
        specifications: [
          { name: "Screen Size", value: "6.8 inches" },
          { name: "Storage", value: "32GB" },
          { name: "Battery Life", value: "10 weeks" },
        ],
        images: [
          {
            url: "https://m.media-amazon.com/images/G/39/kindle/journeys/X9BVIdSbtOPJnwDypIcEKbFCqMys4ush0jMnhaBQCUg3D/MDJiYjFkYjEt._CB641350327_.jpg",
            alt: "Amazon Kindle Paperwhite",
          },
        ],
        stock: 300,
        rating: 4.9,
        reviews_count: 14500,
        features: ["Adjustable Warm Light", "Waterproof"],
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

// Add this new endpoint
app.get("/api/products/:id", async (req, res) => {
  try {
    const result = await client.get({
      index: "products",
      id: req.params.id,
    });

    if (result._source) {
      res.json({
        id: result._id,
        ...result._source,
      });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Product fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add this new endpoint
app.post("/api/products", async (req, res) => {
  try {
    const product = req.body;

    // Validate required fields
    const requiredFields = [
      "name",
      "description",
      "price",
      "brand",
      "category",
    ];
    const missingFields = requiredFields.filter((field) => !product[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Index the product
    const result = await client.index({
      index: "products",
      document: product,
    });

    // Refresh the index to make the document immediately available
    await client.indices.refresh({ index: "products" });

    res.status(201).json({
      message: "Product added successfully",
      id: result._id,
      product,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//set the port for the server to listen on
const PORT = process.env.PORT || 3001;

//start the express js server and initialize the data (if the index doesn't exist it will be created and sample data will be added to it)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeData();
});
