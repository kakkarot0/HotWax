const express = require('express');
const mysql = require('mysql2');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());



const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'assign',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Get all persons
app.get('/api/person', (req, res) => {
    db.query('SELECT * FROM person', (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(results);
    });
  });

  // API endpoint to create a person
app.post('/api/person', (req, res) => {
    const { party_id, first_name, middle_name, last_name, gender, birth_date, marital_status_enum_id, employment_status_enum_id, occupation } = req.body;
  
    // Validation
    if (!first_name || !last_name || !gender || !birth_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    // Database query
    const query = `
      INSERT INTO person (
        party_id, first_name, middle_name, last_name, gender, birth_date, marital_status_enum_id, employment_status_enum_id, occupation
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    // Execute the query with parameters
    db.query(
      query,
      [party_id, first_name, middle_name, last_name, gender, birth_date, marital_status_enum_id, employment_status_enum_id, occupation],
      (err, result) => {
        if (err) {
          console.error('Error inserting into person table:', err);
          // Return a more specific error message to the client
          return res.status(500).json({ error: 'Error inserting data into the database' });
        }
  
        const personId = result.insertId;
        res.json({ personId });
      }
    );
  });
//   -------------------------------------------------------------
//   // Add Order Items API
// app.post('/api/add-order-items', (req, res) => {
//     const {
//       order_id,
//       order_name,
//       placed_date,
//       approved_date,
//       status_id = 'OrderPlaced',
//       party_id,
//       currency_uom_id = 'USD',
//       product_store_id,
//       sales_channel_enum_id,
//       grand_total,
//       completed_date,
//       order_items,
//     } = req.body;
  
//     // Check if customer data is provided
//     if (!party_id) {
//       res.status(400).json({ error: 'Customer data (party_id) is mandatory for adding items to an order.' });
//       return;
//     }
  
//     // Check if order items list is provided
//     if (!order_items || order_items.length === 0) {
//       res.status(400).json({ error: 'Order items list is mandatory for adding items to an order.' });
//       return;
//     }
  
//     // Iterate through order items and insert into the database
//     for (const item of order_items) {
//       const {
//         order_item_seq_id,
//         product_id,
//         item_description,
//         quantity,
//         unit_amount,
//         item_type_enum_id,
//       } = item;
  
//       // Insert into order_items table
//       const query = `
//         INSERT INTO order_items (
//           order_id, order_item_seq_id, product_id, item_description,
//           quantity, unit_amount, item_type_enum_id
//         )
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//       `;
  
//       db.query(
//         query,
//         [
//           order_id,
//           order_item_seq_id,
//           product_id,
//           item_description,
//           quantity,
//           unit_amount,
//           item_type_enum_id,
//         ],
//         (err) => {
//           if (err) {
//             console.error('Error inserting into order_items table:', err);
//             res.status(500).json({ error: 'Internal Server Error' });
//             return;
//           }
//         }
//       );
//     }
  
//     // Return success response
//     res.json({
//       orderId: order_id,
//       orderPartSeqId: order_items[order_items.length - 1].order_item_seq_id,
//     });
//   });

//   // Get all orders
// app.get('/api/orders', (req, res) => {
//     const query = `
//       SELECT 
//         order_id, order_name, placed_date, approved_date, status_id, party_id, currency_uom_id,
//         product_store_id, sales_channel_enum_id, grand_total, completed_date
//       FROM order_header
//     `;
  
//     db.query(query, (err, results) => {
//       if (err) {
//         console.error('Error querying database:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//         return;
//       }
  
//       const orders = results.map((order) => {
//         return {
//           order_id: order.order_id,
//           order_name: order.order_name,
//           placed_date: order.placed_date,
//           approved_date: order.approved_date,
//           status_id: order.status_id,
//           party_id: order.party_id,
//           currency_uom_id: order.currency_uom_id,
//           product_store_id: order.product_store_id,
//           sales_channel_enum_id: order.sales_channel_enum_id,
//           grand_total: order.grand_total,
//           completed_date: order.completed_date,
//         };
//       });
  
//       res.json({ orders });
//     });
//   });

//   const postNewOrder =  (req, res) => {
//     const newOrder = req.body;
//     db.query('INSERT INTO Order_Header SET ?', newOrder, (err, result) => {
//       if (err) {
//         console.error('Error executing query:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//       } else {
//         res.json({ orderId: result.insertId });
//       }
//     });
//   };

const postNewOrder =  (req, res) => {
    const newOrder = req.body;
    db.query('INSERT INTO Order_Header SET ?', newOrder, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ orderId: result.insertId });
      }
    });
  };




  const postOrderitem = async(req, res) => {
    const addItem = req.body;
   
    db.query('INSERT INTO order_item SET ?', addItem, (err,result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          }
      else {
        res.json({ orderId: result.insertId });
      }
    });
  };


  

  const getOrder = async(req, res) => {
  
    db.query('SELECT * FROM Order_Header', (error, results) => {
        if (error) throw error;
        res.json(results);
      });
  };


const getOneOrder = async (req, res) => {
    const { id } = req.params;
    
    // Ensure that id is a string
    const orderId = String(id);

    db.query(`SELECT * FROM Order_Header WHERE ORDER_ID = '${orderId}'`, (error, results) => {
      if (error) throw error;
      res.json(results[0]);
    });
};


  
  const putUpdateOrder = async(req, res) => {
    const { id } = req.params;
    const updatedOrder = req.body;
    db.query('UPDATE order_header SET ? WHERE order_id = ?', [updatedOrder, id], (error) => {
      if (error) throw error;
      res.json({ message: 'Order updated successfully' });
    });
  };



  const getPerson = async(req, res) => {
  
    db.query('SELECT * FROM Person', (error, results) => {
        if (error) throw error;
        res.json(results);
      });
  };

  const getOrderItem = async(req, res) => {
  
    db.query('SELECT * FROM order_item', (error, results) => {
        if (error) throw error;
        res.json(results);
      });
  };

  

app.post("/order" , postNewOrder)

app.post("/orderItem" , postOrderitem)

app.get("/orders", getOrder)

app.get("/order/:id" ,getOneOrder)

app.put("/order/:id" , putUpdateOrder)

//app.post("/person" , postPerson)
//app.get("/persons" ,getPerson)
app.get("/orderItem",getOrderItem)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});