import { NextFunction, Request, Response } from 'express'
import { CustomError } from '../../shared/errors/custom-error'
import { TransactionService } from './transaction-service'
import transactionValidator from './transaction-validator'
import paramsValidator from '../../shared/validators/params-validator'
const service = new TransactionService()
export class TransactionController {
  async list(req: Request, res: Response, next: NextFunction) {
    console.log('list')
    try {
      const { userId, startDate, endDate, page, limit, orderBy } =
        await transactionValidator.findManyParams.validate({
          userId: req.headers.userId,
          startDate: req.query.startDate,
          endDate: req.query.endDate,
          page: req.query.page,
          limit: req.query.limit,
          orderBy: req.query.orderBy,
        })

      const transactions = await service.findMany(
        userId,
        startDate,
        endDate,
        page,
        limit,
        orderBy
      )
      res.status(200).json(transactions)
    } catch (error) {
      next(error)
    }
  }

  async listOne(req: Request, res: Response, next: NextFunction) {
    console.log('liistOne')
    try {
      const { userId, id } = await paramsValidator.index.validate({
        userId: req.headers.userId,
        id: req.params.id,
      })
      const transaction = await service.findOne(id, userId)
      res.status(200).json(transaction)
    } catch (error) {
      next(error)
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    console.log('create')
    try {
      await transactionValidator.body.validate(req.body)
      const userId = await paramsValidator.userId.validate(req.headers.userId)

      const transaction = await service.create(userId, req.body)
      res.status(201).json({ id: transaction })
    } catch (error) {
      next(error)
    }
  }

  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, id } = await paramsValidator.index.validate({
        userId: req.headers.userId,
        id: req.params.id,
      })
      await transactionValidator.body.validate(req.body)
      const transaction = await service.update(id, userId, req.body)
      res.status(201).json({ id: transaction })
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    console.log('delete')
    try {
      const { userId, id } = await paramsValidator.index.validate({
        userId: req.headers.userId,
        id: req.params.id,
      })
      await service.delete(id, userId)
      res.status(200).json({})
    } catch (error) {
      next(error)
    }
  }

  async listMetrics(req: Request, res: Response, next: NextFunction) {
    console.log('controller')
    try {
      const { userId, startDate, endDate } =
        await transactionValidator.findMetricsParams.validate({
          userId: req.headers.userId,
          startDate: req.query.startDate,
          endDate: req.query.endDate,
        })

      const metrics = await service.getMetrics(userId, startDate, endDate)
      res.status(200).json(metrics)
    } catch (error) {
      next(error)
    }
  }
}
