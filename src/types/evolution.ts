export type FetchGroups = {
    id: string,
    name?: string,
    subject: string,
    subjectTime: number,
    pictureUrl: string,
    size: number,
    creation: number,
    owner: string,
    restrict: boolean,
    announce: boolean,
    isCommunity: boolean,
    isCommunityAnnounce: boolean
}

export type dbBusinessMessaging = {
    id: string,
    business: string,
    phone: string, // grupo
    message: string,
    weekdays: number[],
    format: 'semanal' | 'diario',
    active: boolean
}
