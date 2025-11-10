const { Order, Service, User, SubCategory, Category } = require("../models");
const { getCurrentMonth, getMonth } = require("../utils/Date");

const getOrders = async (month) => {
  let ServiceOrders = [];
  const orders = await Order.find({}).sort({ createdAt: "desc" }).limit(10);
  for (const order of orders) {
    const category = await Service.findOne({ _id: order.service }).populate(
      "category"
    );
    ServiceOrders.push({ ...category.category.toObject(), order });
  }

  return ServiceOrders;
};

const getStatsSummary = async () => {
  const currentTime = new Date();
  const startOfTheMonth = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    1
  );
  const startsOfTheNextMonth = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth() + 1,
    1
  );
  const totalOrders = await Order.countDocuments({
    createdAt: { $gte: startOfTheMonth, $lt: startsOfTheNextMonth },
  });
  let totalEarnings = 0;
  const completedOrders = await Order.find({
    status: "completed",
    createdAt: { $gte: startOfTheMonth, $lt: startsOfTheNextMonth },
  }).populate("service");
  for (const comOrder of completedOrders) {
    totalEarnings +=
      comOrder.amount - comOrder.service.serviceCommission * comOrder.quantity;
  }
  const totalEmployee = await User.countDocuments({
    role: "employee",
    isApproved: true,
  });

  const totalClient = await User.countDocuments({
    role: "client",
  });
  return { totalOrders, totalClient, totalEmployee, totalEarnings };
};

const incomeStats = async () => {
  let incomeStatArr = [];
  const currentTime = new Date();
  for (let i = 12; i >= 0; i--) {
    const startOfTheMonth = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth() - i,
      1
    );
    const startsOfTheNextMonth = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth() - i + 1,
      1
    );

    let totalEarnings = 0;
    const completedOrders = await Order.find({
      status: "completed",
      createdAt: { $gte: startOfTheMonth, $lt: startsOfTheNextMonth },
    }).populate("service");
    for (const comOrder of completedOrders) {
      totalEarnings +=
        comOrder.amount - comOrder.service?.serviceCommission ||
        0 * comOrder.quantity;
    }

    incomeStatArr.push({ month: startOfTheMonth, income: totalEarnings });
  }
  console.log(incomeStatArr);
  return incomeStatArr;
};

const getIncomeStats = async () => {
  let stats = {};
  const completedOrders = await Order.find({
    status: "completed",
  }).populate("service");

  for (const order of completedOrders) {
    const date = new Date(order.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth();

    const earning =
      (order.amount - (order.service?.serviceCommission || 0)) * order.quantity;

    if (!stats[year]) stats[year] = {};
    if (!stats[year][month]) stats[year][month] = 0;

    stats[year][month] += earning;
  }

  return stats;
};

const getUserRatio = async () => {
  let ratioArr = [];

  for (let i = 12; i >= 0; i--) {
    const startMonth = getMonth(-i);
    const nextMonth = getMonth(-i + 1);

    // console.log({ startMonth, nextMonth });

    const employees = await User.countDocuments({
      role: "employee",
      isApproved: true,
      createdAt: { $gte: startMonth, $lt: nextMonth },
    });

    const clients = await User.countDocuments({
      role: "client",
      createdAt: { $gte: startMonth, $lt: nextMonth },
    });

    ratioArr.push({
      month: startMonth,
      clients,
      employees,
    });
  }

  return ratioArr;
};

const getOrderStats = async () => {
  const resultArr = [];
  const categories = await Category.find();

  for (const category of categories) {
    const subCategories = await SubCategory.find({
      category: category._id,
      isDeleted: false,
    });

    const subCategoryArr = [];

    for (const subCategory of subCategories) {
      const services = await Service.find({
        subCategory: subCategory._id,
        category: category._id,
        isDeleted: false,
      });

      const ordersArr = [];

      for (const service of services) {
        const orders = await Order.find({ service: service._id })
          .sort({ createdAt: -1 })
          .populate("service");
        ordersArr.push(...orders);
      }

      subCategoryArr.push({
        ...subCategory.toObject(),
        orders: ordersArr, // attach all orders for this subCategory
      });
    }

    resultArr.push({
      ...category.toObject(),
      subCategories: subCategoryArr,
    });
  }

  return resultArr;
};

const getDashboardStats = async () => {
  const statsSummary = await getStatsSummary();
  const monthlyIncome = await incomeStats();
  const yearlyIncome = await getIncomeStats();
  const userRatio = await getUserRatio();
  const orderStats = await getOrderStats();

  return {
    statsSummary,
    monthlyIncome,
    yearlyIncome,
    userRatio,
    orderStats,
  };
};

module.exports = {
  getDashboardStats,
  getIncomeStats,
  getStatsSummary,
  getUserRatio,
  getOrderStats,
};
