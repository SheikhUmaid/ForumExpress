import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Query from "../models/query.model.js"
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";

const CreateQuery = asyncHandler(async (req,res) => {
    const {title, content, tags, language} = req.body;
    const user = req.user;
    if(!user){
        throw new ApiError(401, "unauthenticated user");
    }
    if ([title, content].some((el)=> el.trim() === "")){
        throw new ApiError(401, "tittle and content is required")
    }

    const query = await Query.create({
        user: user._id,
        title: title,
        content: content,
        tags:tags,
    })

    const loggedInUser =  await User.findById(user._id)

    loggedInUser.quries.push(query);
    await loggedInUser.save({
        valadateBeforeSave: false
    })
    return res.status(200).json(
        new ApiResponse(200, query, "Query Created Successfully")
    )

})



const UpdateQuery = asyncHandler(async (req, res) => {
    const {queryId} = req.params;
    const {title, content, tags, language} = req.body;
    const user = req.user;
    if(!user){
        throw new ApiError(401, "Unauthenticated user");
    }
    // if (!title || !content)
    // if ([title, content].some((el) => el.trim() === "")) {
    //     throw new ApiError(400, "Title and content are required");
    // }

    const query = await Query.findById(queryId);

    if (!query) {
        throw new ApiError(404, "Query not found");
    }

    if (query.user.toString() !== user._id.toString()) {
        throw new ApiError(403, "You do not have permission to edit this query");
    }
    
    const hasChanged = 
    title !== query.title || content !== query.content

    if (hasChanged){
        query.content = content || query.content;
        query.tags = tags || query.tags;
        query.language = language || query.language;
        query.edited = true;
    }

    await query.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            query,
            "Query apdated Successfully"
        )
    )
})



const GetOneQuery = asyncHandler(async(req,res)=>{
    const {queryId} = req.params;
    if(!queryId){
        throw new ApiError(401, "Query Id is required")
    }
    const query = await Query.findById(queryId)
    if(!query){
        throw new ApiError(404, "Query Does not exist");
    }
    return res.status(200).json(
        new ApiResponse(200, query, "Query retrieved")
    )
})



const DeleteQuery = asyncHandler(async (req,res)=>{
    const {queryId} = req.params;
    if(!queryId){
        throw new ApiError(401, "Query Id is required")
    }
    const query = await Query.findByIdAndDelete(queryId)
    if(!query){
        throw new ApiError(404, "Query Does not exist");
    }
    return res.status(200).json(
        new ApiResponse(200,{}, "Query has been Deleted Successfully")
    )
})



const GetAllQueries =asyncHandler(async(_,res)=>{
    const queries = await Query.find();
    if(!queries){
        throw new ApiError(500, "Something went wrong while fetching Queries")
    }
    res.status(200).json(
        new ApiResponse(200, queries, "Fetched queries successfully")
    )
})




const GetQueriesOfUser = asyncHandler(async(req,res)=>{
    const {userId} = req.params;
    
    const user = await User.findById(userId);

    if(!user){
        throw new ApiError(404, "User Not Found");
    }

    const queries = await Query.find({
        user:userId
    }).populate("user");

    if(!queries){
        throw new ApiError(400, "No queries found")
    }

    res.status(200).json(
        new ApiResponse(200, queries, "Queries of UserId" + userId)
    )

})





const SearchQueries = asyncHandler(async(req,res)=>{
    const searchQuery = req.query.searchQuery;



    if(!searchQuery){
        throw new ApiError(400, "Query is required!")
    }

    const foundQueries = await Query.find({
        $or:[
            {title: {$regex: searchQuery, $options: "i"}},
            {content: {$regex: searchQuery, $options: "i"}},
            {tags: {$regex: searchQuery, $options: "i"}},
        ]
    })

    if(!foundQueries){
        throw new ApiError(404, "not found any queries")
    }


    res.
    status(200).
    json(
        new ApiResponse(200, foundQueries, "found queries about " + searchQuery)
    );

})
export {CreateQuery, UpdateQuery, GetOneQuery, DeleteQuery, GetAllQueries, GetQueriesOfUser, SearchQueries}


