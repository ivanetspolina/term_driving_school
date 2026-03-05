const TestResult = require("../models/TestResult");

exports.getTestAnalytics = async (req, res) => {
  try {
    const data = await TestResult.aggregate([
      {
        $addFields: {
          avgTimePerQuestion: { $avg: "$questionTimes" }
        }
      },
      {
        $lookup: {
          from: "tests",
          localField: "topic",
          foreignField: "_id",
          as: "testInfo"
        }
      },
      { $unwind: "$testInfo" },
      // 3. нормалізуємо назву теми, щоб згенеровані тести
      {
        $addFields: {
          topicBaseName: {
            $let: {
              vars: {
                idx: { $indexOfBytes: ["$testInfo.name", " ("] }
              },
              in: {
                $cond: [
                  { $gte: ["$$idx", 0] },
                  { $substrBytes: ["$testInfo.name", 0, "$$idx"] },
                  "$testInfo.name"
                ]
              }
            }
          }
        }
      },
      // 4. підтягуємо дані про користувача (щоб взяти drivingStatus)
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      // 5. групуємо по базовій назві теми та статусу користувача
      {
        $group: {
          _id: {
            topicName: "$topicBaseName",
            status: "$userInfo.drivingStatus"
          },
          avgTime: { $avg: "$avgTimePerQuestion" }
        }
      },
      // 6. групуємо ще раз по назві теми
      {
        $group: {
          _id: "$_id.topicName",
          data: {
            $push: {
              status: "$_id.status",
              avgTime: "$avgTime"
            }
          }
        }
      },
      // 7. приводимо результат у потрібний формат
      {
        $project: {
          topicName: "$_id",
          yes: {
            $first: {
              $map: {
                input: {
                  $filter: {
                    input: "$data",
                    as: "d",
                    cond: { $eq: ["$$d.status", "Так"] }
                  }
                },
                as: "d",
                in: "$$d.avgTime"
              }
            }
          },
          learning: {
            $first: {
              $map: {
                input: {
                  $filter: {
                    input: "$data",
                    as: "d",
                    cond: { $eq: ["$$d.status", "Навчаюсь"] }
                  }
                },
                as: "d",
                in: "$$d.avgTime"
              }
            }
          },
          no: {
            $first: {
              $map: {
                input: {
                  $filter: {
                    input: "$data",
                    as: "d",
                    cond: { $eq: ["$$d.status", "Ні"] }
                  }
                },
                as: "d",
                in: "$$d.avgTime"
              }
            }
          }
        }
      }
    ]);

    res.json(data);
  } catch (error) {
    console.error("Помилка агрегації:", error);
    res.status(500).json({ error: "Помилка серверу" });
  }
};


// const TestResult = require("../models/TestResult");

// exports.getTestAnalytics = async (req, res) => {
//   try {

//     // const data = await TestResult.aggregate([
//     //   {
//     //     $group: {
//     //       _id: { topic: "$topic", status: "$drivingStatus" },
//     //       avgTime: { $avg: "$avgTimePerQuestion" }
//     //     }
//     //   },
//     //   {
//     //     $group: {
//     //       _id: "$_id.topic",
//     //       data: {
//     //         $push: {
//     //           status: "$_id.status",
//     //           avgTime: "$avgTime"
//     //         }
//     //       }
//     //     }
//     //   },
//     //   {
//     //     $project: {
//     //       topic: "$_id",
//     //       yes: {
//     //         $first: {
//     //           $map: {
//     //             input: {
//     //               $filter: {
//     //                 input: "$data",
//     //                 as: "d",
//     //                 cond: { $eq: ["$$d.status", "Так"] }
//     //               }
//     //             },
//     //             as: "d",
//     //             in: "$$d.avgTime"
//     //           }
//     //         }
//     //       },
//     //       learning: {
//     //         $first: {
//     //           $map: {
//     //             input: {
//     //               $filter: {
//     //                 input: "$data",
//     //                 as: "d",
//     //                 cond: { $eq: ["$$d.status", "Навчаюсь"] }
//     //               }
//     //             },
//     //             as: "d",
//     //             in: "$$d.avgTime"
//     //           }
//     //         }
//     //       },
//     //       no: {
//     //         $first: {
//     //           $map: {
//     //             input: {
//     //               $filter: {
//     //                 input: "$data",
//     //                 as: "d",
//     //                 cond: { $eq: ["$$d.status", "Ні"] }
//     //               }
//     //             },
//     //             as: "d",
//     //             in: "$$d.avgTime"
//     //           }
//     //         }
//     //       }
//     //     }
//     //   }
//     // ]);

//     res.json(data);
//   } catch (error) {
//     console.error("Помилка агрегації:", error);
//     res.status(500).json({ error: "Помилка серверу" });
//   }
// };
