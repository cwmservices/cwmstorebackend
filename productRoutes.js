require("dotenv").config();
const cookieParser = require("cookie-parser");
const stripe = require("stripe")(process.env.PRIVATE_KEY);

const express = require("express");
const router = express.Router();

const auth = require("./db/middleware/auth");

const Products = require("./db/models/products");
const Posts = require("./db/models/posts");
const User = require("./db/models/users");

router.use(cookieParser());

//product post and add.
router.post("/product", auth, async (req, res) => {
  try {
    const category = req.body.category;
    const name = req.body.name;
    const image = req.body.image;
    const price = Number(req.body.price);
    const desc = req.body.desc;

    await Products.insertMany({
      id: 11,
      quantity: 1,
      category: category,
      name: name,
      imgUrl: image,
      price: price,
      total: price,
      desc: desc,
    });

    console.log("Product Added!");
    res.status(200).json({ message: "Post Added!" });
  } catch (error) {
    console.log(error);
  }
});

// get all products.

router.get("/products", async (req, res) => {
  try {
    const products = await Products.find({});

    res.json(products);

    console.log("data passed to front end");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

// get indivisual products.

router.get("/products/:id", async (req, res) => {
  try {
    const products = await Products.find({ _id: req.params.id });

    res.json(products);

    console.log("data passed to front end");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

//post the blog posts.

router.post("/post", auth, async (req, res) => {
  try {
    const title = req.body.title;
    const image = req.body.image;
    const desc = req.body.desc;

    await Posts.insertMany({
      id: 10,
      title: title,
      image: image,
      desc: desc,
    });

    console.log("Post Added!");
    res.status(200).json({ message: "Post Added!" });
  } catch (error) {
    console.log(error);
  }
});

//get all posts.

router.get("/posts", async (req, res) => {
  try {
    const posts = await Posts.find({});

    res.json(posts);

    console.log("data passed to front end");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

//get indivisual posts.

router.get("/posts/:id", async (req, res) => {
  try {
    const posts = await Posts.find({ _id: req.params.id });

    res.json(posts);

    console.log("data passed to front end");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

//payment handling ends here

router.post("/payment", async (req, res) => {
  const { totalAmount, totalItemsPurchased, token } = req.body;

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create({
        amount: totalAmount * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `purchased ${totalItemsPurchased} items`,
      });
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

//handling signup
router.post("/signup", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const cpassword = req.body.cpassword;
  if (!name || !email || !password || !cpassword) {
    console.log("Please fill all the field");
  }

  try {
    const check = await User.findOne({ email: email });
    if (check) {
      console.log("Please, Try Another Email It Is Already Exist!");
    }

    if (password == cpassword) {
      const userData = new User({
        name: name,
        email: email,
        password: password,
        cpassword: cpassword,
      });

      await userData.generateAuthToken();
      await userData.save();
      res.status(200).json({
        message: "Successfully, created a new user with token and id",
      });
    } else {
      console.log("password are not matching");
    }
  } catch (error) {
    console.log(error);
  }
});

//login handling

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    console.log("Please fill all the required fields");
  }

  try {
    const signInData = await User.findOne({ email: email });
    if (signInData) {
      // const isMatch = await bcrypt.compare(password, signInData.password);
      // console.log(isMatch);

      const token = await signInData.generateAuthToken();

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 108000000),
        httpOnly: true,
      });

      if (password != signInData.password) {
        console.log("Invalid Credentials");
      } else {
        res.status(200).json({ message: "signin successfully" });
      }
    } else {
      console.log("Email Not Exist!");
    }
  } catch (error) {
    console.log(error);
  }
});

//logout handling

router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken");
  res.status(200).json({ message: "user logout" });
});

//contact post
router.post("/contact", auth, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      console.log("please fill the fields in contact page");
    }

    const contactUser = await User.findOne({ _id: req.userId });

    if (contactUser) {
      const userMessages = contactUser.addUserMessages(name, email, message);
      await contactUser.save();
      res.status(200).json({ message: "data send to database successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

//contact authenticate page
router.get("/contact", auth, (req, res) => {
  res.send(req.rootUser);
});

router.get("/blog", auth, (req, res) => {
  res.send(req.rootUser);
});

router.get("/cart", auth, (req, res) => {
  res.send(req.rootUser);
});

router.get("/whishlist", auth, (req, res) => {
  res.send(req.rootUser);
});

router.get("/about", auth, (req, res) => {
  res.send(req.rootUser);
});

// router.get("/addproducts", auth, (req, res) => {
//   res.send(req.rootUser);
// });

// router.get("/addposts", auth, (req, res) => {
//   res.send(req.rootUser);
// });

// router.get("/adminlogin", (req, res) => {
//   const data = {
//     name: "Masood",
//     password: "adminBoard",
//   };
//   if (data.name == req.params.name && req.params.password) {
//     res.status(200).json({ message: "Login To Dashboard Successfully!" });
//   } else {
//     res.status(400).json({ message: "Login To Dashboard Is Mandatroy!" });
//   }
// });

router.get("/check", auth, (req, res) => {
  res.send(req.rootUser);
});

module.exports = router;
