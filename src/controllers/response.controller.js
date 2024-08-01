import Query from "../models/query.model.js";
import Response from "../models/response.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const CreateResponse = asyncHandler(async (req, res) => {
    const content = req.body.content;
    const queryId = req.params.queryId;
    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    if (!queryId) {
        throw new ApiError(400, "Needed Query");
    }

    const fetchedQuery = await Query.findById(queryId);

    if (!fetchedQuery) {
        throw new ApiError(404, "Given Query not Found");
    }
    const createdResponse = await Response.create({
        user: req.user._id,
        content: content,
        query: queryId,
    });

    fetchedQuery.responses.push(createdResponse);
    await fetchedQuery.save();
    res.status(200).json(
        new ApiResponse(200, createdResponse, "Reponse Created Successflully")
    );
}); //route done

const GetResponsesByUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if(!userId) throw new ApiError(400, "Unauthorized Request");

    const responses = await Response.find({
        user: userId
    });

    if(!responses) throw new ApiError(404, "Something went Wrong in finding responses");

    return res.
    status(200).
    json(
        new ApiResponse(200, responses, "Fetched responses of the user " + userId )
    )

});

const DeleteResponse = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const responseToDelete = req.params.responsetodelete;

    if(!userId) throw new ApiError(400, "Unauthorized Request");
    
    if(!responseToDelete) throw new ApiError(400, "requesttodelete is required");

    const response =  await Response.findById(responseToDelete);
    if(response.user._id != userId) throw new ApiError(400, "This user is not permitted to delete this user")
    console.log(abc);

    return res.status(200).json(
        new ApiResponse(200, {}, "Deleted successfulyy")
    )
}); //route done

const UpdateResponse = asyncHandler(async (req, res) => {
    const responseId = req.params.responseid;
    const userId = req.user._id;
    const content = req.body.content;
    if(!userId) throw new ApiError(400, "Login required");
    if(!response) throw new ApiError(400, "reponse parameter required");
    const response = await Response.findById(responseId);
    if(response.user._id != userId) throw new ApiError(400, "this user is not permitted to update this response ");
    if(response.content != content) hasChanged = 1;
    else hasChnaged = 0;
    if(hasChanged){
        response.content = content || response.content ;
        response.isEditted = true;
        await response.save();
    }

    return res.
    status(200).
    json(
        new ApiResponse(200, response, "The response has been updated successfully")
    )
}); //route done


const AddApproval = asyncHandler(async (req, res) => {
    const responseId = req.params.responseid;
    const userId = req.user._id;
    if(!userId) throw new ApiError(400, "Login required");
    if(!response) throw new ApiError(400, "reponse parameter required");
    const response = await Response.findById(responseId);
    if(response.query.user._id != userId) throw new ApiError(400, "you are not permited to approve this response");
    response.isApproved = true;
    await response.save();
    return res.
    status(200).
    json(
        new ApiResponse(200, response, "the response has been aproved successfully")
    )
}); //route done

const AddLike = asyncHandler(async (req, res) => {});

const AddDislike = asyncHandler(async (req, res) => {});



export {
    CreateResponse,
    GetResponsesByUser,
    UpdateResponse,
    DeleteResponse,
    AddLike,
    AddDislike,
    AddApproval,
};






// chin tapak dum dum
// halalulya 
// bale bale te shava shava