import { CategoryRequestBody } from './category-entity';
export declare class CategoryService {
    getSummaryOfCategoriesByPeriod(userId: string, type: boolean, starrtDate: string, endDate: string): Promise<import("./category-entity").CategoryChart[]>;
    findAllCategoriesByType(type: boolean): Promise<{
        id: string;
        title: string;
        type: boolean;
    }[]>;
    findOne(id: string): Promise<import("./category-entity").Category>;
    create(dto: CategoryRequestBody): Promise<string>;
    update(id: string, dto: CategoryRequestBody): Promise<string>;
    delete(id: string): Promise<void>;
}
