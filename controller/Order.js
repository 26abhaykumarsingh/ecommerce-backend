const { Order } = require("../model/Order");

exports.fetchOrderByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ user: userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createOrder = async (req, res) => {
  //this product we have to get from API body
  const order = new Order(req.body);
  try {
    const doc = await order.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      //no need to send entire product as body, just the data fields you wanna change.
      new: true,
    }); //findbyid finds by objectId ig, so whatever you put in there is compared with _id and not id or whatever data field you have made
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllOrders = async (req, res) => {
  //here we need a query string

  //filter = {"category":["smartphone","laptops"]}
  //sort = {_sort: price, _order="desc"}
  // pagination = {_page:1, _limit=10} //_page=1&_limit=10

  //TODO : we have to try with multiple category and brands after change in front-end
  let query = Order.find({ deleted: { $ne: true } });
  let totalOrdersQuery = Order.find({}); //adding .count() to query will execute it (and it can be executed once only) which we dont want so making copy of it

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order }); // "title" : "order"
    totalOrdersQuery = totalOrdersQuery.sort({
      [req.query._sort]: req.query._order,
    }); // "title" : "order"
  }

  const totalDocs = await totalOrdersQuery.count().exec(); //mongodb doesnt add X-total-count header, so we adding it ourselves

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs); //adding header
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};
