import { volunteeringModel } from "../models/volunteeringModel.js";
import { userModel } from "../models/user_model.js";
import { volunteerSchema } from "../Schema/volunteeringSchema.js";

export const addVolunteer = async (req, res) => {
  try {
    const { error, value } = volunteerSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    // Find the user with the ID that you passed when creating the volunteer
    const id = req.session?.user?.id || req?.user?.id;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Create volunteer with the value
    const volunteer = await volunteeringModel.create({ ...value, user: user.id })

    // Push the volunteer ID you just created into the user's volunteer array
    user.volunteering.push(volunteer._id);

    // Save the user now with the volunteer
    await user.save();

    // Return the volunteer
    res.status(201).json({ volunteer });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// Get all volunteers
export const allVolunteer = async (req, res) => {
  try {
    const userId = req.session?.user?.id || req?.user?.id;
    if (!userId) {
        return res.status(401).send('Unauthorized: User ID is missing');
    }
    const allVolunteers = await volunteeringModel.find({user:userId});
    // if (allVolunteers.length === 0) {
    //   return res.status(404).send('No Volunteer added');
    // }

    res.status(200).json({ volunteers: allVolunteers, message:"Volunteer Added Sucessfully"});
  } catch (error) {

    return res.status(500).send(error.message);
  }
};

// Get a single volunteer by ID
export const getVolunteer = async (req, res) => {
  try {
    const volunteer = await volunteeringModel.findById(req.params.volunteerId);

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.status(200).json(volunteer);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: 'An error occurred while fetching volunteer' });
  }
};

// Update volunteer
export const updateVolunteer = async (req, res) => {
  try {
    const { error, value } = volunteerSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const updatedVolunteer = await volunteeringModel.findByIdAndUpdate(
      req.params.volunteerId,
      value,
      { new: true }
    );

    if (!updatedVolunteer) {
      return res.status(404).send('Volunteer not found');
    }

    res.status(201).json({ volunteer: updatedVolunteer,message:"Volunteer Updated Sucessfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// Delete volunteer
export const deleteVolunteer = async (req, res) => {
  try {
    const deletedVolunteer = await volunteeringModel.findByIdAndDelete(req.params.volunteerId);

    if (!deletedVolunteer) {
      return res.status(404).send('Volunteer not found');
    }

    // Remove volunteer from user
    const user = await userModel.findById(deletedVolunteer.user);
    if (user) {
      user.volunteer = user.volunteer.filter(volunteerId => volunteerId.toString() !== req.params.volunteerId);
      await user.save();
    }

    res.status(201).json({ volunteer: deletedVolunteer,message:"Volunteer Deleted Sucessfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
