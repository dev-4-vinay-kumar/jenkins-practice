import { PrismaClient } from '@prisma/client';
import { error } from 'console';

// const prisma = new PrismaClient();
type PrismaModel = keyof PrismaClient;

type StringFields<T> = {
    [K in keyof T]: string;
}[keyof T];

type SearchableFields = {
    [K in PrismaModel]: StringFields<PrismaClient[K]>;
};

const searchableFields: {
    [K in PrismaModel]?: Array<SearchableFields[K]>;
} = {
    user: ["name"],
    // Add other models as necessary
} as const;

export interface PaginationOptions {
    page: number;
    pageSize: number;
}

export type PaginatedResponse<T> = {
    metaData: {
        size?: number;
        totalPages?: number;
        page?: number;
        totalElements: number;
    };
    data: T[];
}

export type FilterOptions<T> = {
    field: keyof T;
    value: T[keyof T];
    condition: 'contains' | 'equals' | 'lt' | 'gt' | 'has' | 'in' | 'notIn';
}

/**
 * Retrieves paginated data from a specified Prisma model based on the provided filtering criteria.
 *
 * This function queries a Prisma model to fetch a subset of records according to the pagination options and filtering criteria. It calculates the total number of available records and pages to provide metadata along with the paginated data.
 *
 * Use Cases:
 * - *Data Pagination:* Useful for implementing pagination in applications where displaying all records at once is impractical or inefficient.
 * - *User Interface:* Helps in fetching and displaying a limited number of records per page in a user-friendly manner, enhancing performance and user experience.
 * - *Data Management:* Allows for efficient data retrieval and management by dividing large datasets into smaller, more manageable chunks.
 *
 * Workflow:
 * 1. Calculate the number of records to skip and the number of records to fetch based on the current page and page size.
 * 2. Fetch the total count of records matching the whereClause from the specified model.
 * 3. Calculate the total number of pages based on the total record count and page size.
 * 4. Fetch the actual data from the specified model with pagination applied.
 * 5. Return the paginated data along with metadata including total elements, total pages, current page, and size of the current page.
 *
 * @param {PrismaModel} model - The Prisma model from which data is to be fetched. Represents the database table or collection.
 * @param {PaginationOptions} options - The pagination options specifying the current page number and page size.
 * @returns {Promise<PaginatedResponse<T>>} - A promise that resolves to an object containing metadata and the paginated data.
 *
 * @example
 * // Example usage for fetching paginated data from a User model:
 * const options = { page: 1, pageSize: 10 };
 * const whereClause = { isActive: true };
 * const paginatedData = await getPaginatedData('user', options, whereClause);
 * // Result: Contains metadata and the list of users matching the criteria for the current page.
 */
export const getPaginatedData = async<T>(
    prismaModel: PrismaModel,
    pagination: PaginationOptions,
    prismaClient: PrismaClient,
    searchTerm?: string,
    filters?: FilterOptions<T>[]
): Promise<PaginatedResponse<T>> => {
    const { page, pageSize } = pagination;
    const skip = (page - 1) * pageSize;
    let searchClause;
    let filterClause;

    if (searchTerm) {
        searchClause = buildSearchClause(searchTerm, prismaModel)
    }
    if (filters) {
        filterClause = buildFilterClause(filters);
    }

    const totalCount = await (prismaClient[prismaModel] as any).count({
        where: {
            OR: searchClause || {},
            AND: filterClause || {}
        }
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    var data = await (prismaClient[prismaModel] as any).findMany({
        skip,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
    });

    return {
        metaData: {
            totalElements: totalCount,
            totalPages,
            page,
            size: data.length,
        },
        data,
    };
}

export const getAllData = async <T>(
    prismaModel: PrismaModel,
    prismaClient: PrismaClient,
    filters?: FilterOptions<T>[],
    searchTerm?: string,
): Promise<PaginatedResponse<T>> => {
    let searchClause;
    let filterClause;

    if (searchTerm) {
        searchClause = buildSearchClause(searchTerm, prismaModel)
    }
    if (filters) {
        filterClause = buildFilterClause(filters);
    }

    var data = await (prismaClient[prismaModel] as any).findMany({
        where: {
            AND: filterClause || {},
            OR: searchClause || {}
        }
    });
    return {
        metaData: {
            totalElements: data.length,
        },
        data,
    };
}

export const createRecord = async <T>(
    prismaModel: PrismaModel,
    prismaClient: PrismaClient,
    data: T
): Promise<T> => {
    const result = await (prismaClient[prismaModel] as any).create({
        data:data
    });
    return result;
}

export const updateRecord = async <T>(
    prismaModel: PrismaModel,
    prismaClient: PrismaClient,
    data: T,
    id: number
): Promise<T> => {
    const existingData = await (prismaClient[prismaModel] as any).findUnique({
        where: { id: id },
    });
    if (!existingData) {
        throw error(`record with id ${id} not found.`)
    }
    const result = await (prismaClient[prismaModel] as any).update({
        where:{id:id},
        data:data
    });
    return result;
}

export const deleteRecord = async <T>(
    prismaModel: PrismaModel,
    prismaClient: PrismaClient,
    id: number
): Promise<void> => {
    const existingData = await (prismaClient[prismaModel] as any).findUnique({
        where: { id: id },
    });
    if (!existingData) {
        throw error(`record with id ${id} not found.`)
    }
    await (prismaClient[prismaModel] as any).delete({
        where: { id: id },
    });
}

export const getById = async <T>(
    prismaModel: PrismaModel,
    prismaClient: PrismaClient,
    id: number
): Promise<T> => {
    const existingData = await (prismaClient[prismaModel] as any).findUnique({
        where: { id: id },
    });
    if (!existingData) {
        throw error(`record with id ${id} not found.`)
    }
    return existingData;
}

export const buildFilterClause = <T>(filters: FilterOptions<T>[]): Record<keyof T, any> => {
    const filterClause: Record<keyof T, any> = {} as Record<keyof T, any>;

    filters.forEach(filter => {
        filterClause[filter.field] = {
            [filter.condition]: filter.value,
        };
    });

    return filterClause;
}

export const buildSearchClause = (searchTerm: string, prismaModel: PrismaModel) => {
    const fields = searchableFields[prismaModel];
    return fields?.map(field => ({
        [field]: {
            contains: searchTerm,
            mode: 'insensitive'
        }
    }));
}

