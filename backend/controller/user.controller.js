const { UserModel } = require("../models/user.model");

const newRegistration = async (req, res) => {
  const { email, name, password, location, gender, contact } = req.body;

  if (!email || !name || !password || !location || !contact || !gender) {
    return res.status(400).send({
      error: "Kindly Provide All Required Details for Registration.",
      Success: false,
    });
  }

  if (!(gender == "Male" || gender == "Female")) {
    return res.status(400).send({
      msg: "Kindly Provide a Valid Gender details as : { Male/Female } only.",
      Success: false,
    });
  }

//   const isAdmin = false;
  let userVerifiedFlag = true;

  try {
    const userPresent = await UserModel.findOne({ email });
    if (userPresent) {
      userVerifiedFlag = false;
      if (userPresent.isMailVerified) {
        return res.status(400).send({
          Success: false,
          msg: "User is Already Registered with us. Kindly Login using crendentials.",
        });
      } else {
        // * will send the mail to user for verification
        const result = await sendEmailForVerification(
          userPresent._id,
          name,
          email
        );

        if (result) {
          return res.status(400).send({
            Success: true,
            msg: "Kindly Verify Your Email Id.(Email Sent Successfully)",
          });
        } else {
          return res.status(400).send({
            Success: false,
            msg: "Something Went Wrong .Try After Some Time",
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).send({
      error: error.message,
      Success: false,
      msg: "Internal Server Error",
    });
  }

  if (userVerifiedFlag) {
    bcrypt.hash(password, 7, async (err, hash) => {
      if (err) {
        return res.status(400).send({
          msg: " Oops ! Something Went Wrong here. Kindly retry once after sometime.",
          error: err.message,
          Success: false,
        });
      } else {
        try {
          const user = new UserModel({
            email,
            name,
            password: hash,
            location,
            gender,
            contact,
            role,
          });

          await user.save();

          // Email Send For Verification
          const result = await sendEmailForVerification(user._id, name, email);
          console.log("mail send verification result=> ", result);

          if (result) {
            return res.status(400).send({
              Success: true,
              msg: "Your Registration has been successfull. (Kindly Verify Your Email)",
            });
          } else {
            return res.status(400).send({
              Success: false,
              msg: "Something Went Wrong. Try After Some Time",
            });
          }
        } catch (error) {
          return res.status(400).send({
            error: error.message,
            Success: false,
            msg: `Something Went Wrong. (${error.message})`,
          });
        }
      }
    });
  }
};

module.exports = {
  newRegistration,
};
