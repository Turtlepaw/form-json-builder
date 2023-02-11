/**
 * This code has been adapted from https://github.com/discohook/site.
 * Read the license here: https://github.com/discohook/site/blob/main/LICENSE
 */
const server = typeof window === "undefined"

let nextId = server ? -1 : 1

export const getUniqueId = () => {
    try {
        return nextId
    } finally {
        nextId += server ? -1 : 1
    }
}

export const resetNextId = (id = server ? -1 : 1) => {
    nextId = id
}