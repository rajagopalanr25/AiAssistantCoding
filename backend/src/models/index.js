import mongoose from 'mongoose';
import { isUsingMongo, localCollections } from '../config/db.js';
import {
  userSchema,
  problemSchema,
  interviewSchema,
  codeSubmissionSchema,
  aiInteractionSchema,
  evaluationSchema,
  customProblemSchema
} from './schemas.js';

// Mongoose models
const MongoUser = mongoose.model('User', userSchema);
const MongoProblem = mongoose.model('Problem', problemSchema);
const MongoInterview = mongoose.model('Interview', interviewSchema);
const MongoCodeSubmission = mongoose.model('CodeSubmission', codeSubmissionSchema);
const MongoAIInteraction = mongoose.model('AIInteraction', aiInteractionSchema);
const MongoEvaluation = mongoose.model('Evaluation', evaluationSchema);
const MongoCustomProblem = mongoose.model('CustomProblem', customProblemSchema);

// Unified adapter factory
function createModelAdapter(mongoModel, localCollection) {
  return {
    async find(query = {}) {
      if (isUsingMongo()) {
        return await mongoModel.find(query).lean();
      }
      return await localCollection.find(query);
    },
    async findOne(query = {}) {
      if (isUsingMongo()) {
        return await mongoModel.findOne(query).lean();
      }
      return await localCollection.findOne(query);
    },
    async findById(id) {
      if (isUsingMongo()) {
        return await mongoModel.findById(id).lean();
      }
      return await localCollection.findById(id);
    },
    async create(data) {
      if (isUsingMongo()) {
        const item = new mongoModel(data);
        return (await item.save()).toObject();
      }
      return await localCollection.create(data);
    },
    async insertMany(docs) {
      if (isUsingMongo()) {
        return await mongoModel.insertMany(docs);
      }
      return await localCollection.insertMany(docs);
    },
    async findByIdAndUpdate(id, update, options = { new: true }) {
      if (isUsingMongo()) {
        return await mongoModel.findByIdAndUpdate(id, update, options).lean();
      }
      return await localCollection.findByIdAndUpdate(id, update, options);
    },
    async updateOne(query, update) {
      if (isUsingMongo()) {
        return await mongoModel.updateOne(query, update);
      }
      return await localCollection.updateOne(query, update);
    },
    async findByIdAndDelete(id) {
      if (isUsingMongo()) {
        return await mongoModel.findByIdAndDelete(id).lean();
      }
      return await localCollection.findByIdAndDelete(id);
    },
    async countDocuments(query = {}) {
      if (isUsingMongo()) {
        return await mongoModel.countDocuments(query);
      }
      return await localCollection.countDocuments(query);
    },
    async deleteMany(query = {}) {
      if (isUsingMongo()) {
        return await mongoModel.deleteMany(query);
      }
      return await localCollection.deleteMany(query);
    }
  };
}

export const User = createModelAdapter(MongoUser, localCollections.users);
export const Problem = createModelAdapter(MongoProblem, localCollections.problems);
export const Interview = createModelAdapter(MongoInterview, localCollections.interviews);
export const CodeSubmission = createModelAdapter(MongoCodeSubmission, localCollections.submissions);
export const AIInteraction = createModelAdapter(MongoAIInteraction, localCollections.aiInteractions);
export const Evaluation = createModelAdapter(MongoEvaluation, localCollections.evaluations);
export const CustomProblem = createModelAdapter(MongoCustomProblem, localCollections.customProblems);

