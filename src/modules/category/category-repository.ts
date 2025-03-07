import { Category, CategoryChart, CategoryRequestBody } from './category-entity'
import { db } from '../../config/db/index'
import { categorySchema, transactionSchema } from '../../config/db/schema'
import { and, eq, sql } from 'drizzle-orm'
export class CategoryRepository {
  public async getCategoriesByPeriodAndType(
    userId: string,
    type: boolean,
    startDate: string,
    endDate: string
  ): Promise<CategoryChart[]> {
    const totalValueOfTransactions = await db.execute(
      sql`SELECT COALESCE(SUM(${transactionSchema}.value), 0) as total_value_of_transactions 
      FROM ${transactionSchema} 
      WHERE ${transactionSchema}.user_id = ${userId} 
      AND ${transactionSchema}.type = ${type} 
      AND ${transactionSchema.date} BETWEEN ${startDate} AND ${endDate}`
    )
    const totalValueInCategory = await db.execute(
      sql`
       SELECT 
        ${categorySchema}.id, 
        ${categorySchema}.title AS label, 
        ${categorySchema}.color, 
        ${categorySchema}.icon, 
        COALESCE(SUM(${transactionSchema}.value), 0) AS total_spent,
        COALESCE((SUM(${transactionSchema}.value) / ${totalValueOfTransactions[0].total_value_of_transactions}) * 100, 0) AS value
      FROM 
        ${categorySchema}
      LEFT JOIN 
        ${transactionSchema} 
      ON 
        ${transactionSchema}.category_id = ${categorySchema}.id 
        AND ${transactionSchema}.user_id = ${userId}
        AND ${transactionSchema.date} BETWEEN ${startDate} AND ${endDate}
      WHERE 
        ${categorySchema}.type = ${type}
      GROUP BY 
        ${categorySchema}.id, ${categorySchema}.title
      ORDER BY 
        total_spent DESC
      `
    )

    const data: CategoryChart[] = totalValueInCategory.map(category => {
      return {
        id: String(category.id),
        label: String(category.label),
        color: String(category.color),
        icon: String(category.icon),
        value: Number(category.value),
        spent_total: Number(category.total_spent) ?? 0,
      }
    })

    return data
  }

  public async getAllCategoriesByType(type: boolean) {
    const data = await db
      .select({
        id: categorySchema.id,
        title: categorySchema.title,
        type: categorySchema.type,
      })
      .from(categorySchema)
      .where(eq(categorySchema.type, type))

    return data
  }
}
