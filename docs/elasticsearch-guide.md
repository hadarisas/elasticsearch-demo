# Understanding Elasticsearch

## Authors

- EL HADRI HASSAN
- ID-ADMED KAMAL

[GitHub Repository](https://github.com/hadarisas/elasticsearch_demo)

## Introduction

Elasticsearch is an open source distributed, RESTful search and analytics engine, scalable data store, and vector database capable of addressing a growing number of use cases. As the heart of the Elastic Stack, it centrally stores your data for lightning-fast search, fine‑tuned relevancy, and powerful analytics that scale with ease.

## Core Concepts

1. **Forward Index**

   - Maps documents to their terms
   - Like a book's table of contents, it lists which words appear in each document

2. **Inverted Index**

   - Maps terms to documents
   - Like a book's index, it lists which documents contain each word, enabling fast full-text search

3. **Nodes & Shards**

   - Nodes are individual servers in the cluster
   - Shards are pieces of an index distributed across nodes for scalability and reliability

4. **Aliases**

   - Alternative names for indices
   - Allows transparent switching between indices and grouping multiple indices

5. **Data Streams**

   - Time-series data abstraction that automatically manages a sequence of indices
   - Ideal for log and metric data

6. **Mapping**
   - Defines how documents and their fields are stored and indexed
   - Similar to a schema in relational databases

## Elasticsearch vs Relational Databases

1. **Index ≈ Database**

   - Key Difference: Distributed by default

2. **Document ≈ Row**

   - Key Difference: Schema-less (dynamic mapping)

3. **Field ≈ Column**

   - Key Difference: Full-text search capabilities

4. **Mapping ≈ Schema**
   - Key Difference: Real-time analytics

## Common Operations

### 1. Create Index

```json
PUT /my_index
{
  "settings": {
    "number_of_shards": 2,
    "number_of_replicas": 1
  },
  "mappings": {
    "properties": {
"title": { "type": "text" },
      "content": { "type": "text" }
    }
  }
}
```

### 2. Add Document

```json
POST /my_index/doc
{
  "title": "Understanding Elasticsearch",
  "content": "Elasticsearch is a distributed search engine...",
  "date": "2024-03-20",
  "author": "John Doe"
}
```

### 3. Search Documents

```json
GET /my_index/search
{
  "query": {
    "match": {
      "title": "elasticsearch"
    }
  },
  "sort": [{ "date": "desc" }]
}
```

### 4. Create Alias

```json
POST /aliases
{
  "actions": [
    {
      "add": {
        "index": "my_index",
        "alias": "current_index"
      }
    }
  ]
}
```

## Demo Features

### Add Product

Add new products to the Elasticsearch index through a user-friendly interface.

### Search Products

Search and filter products in real-time using Elasticsearch's powerful search capabilities.
