export async function getRdStationMessage(key: string): Promise<string> {
    const messages: Record<string, string> = {
        '7/9': 'lipedema_sete_dias',
        '4/9': 'lipedema_quatro_dias',
        '1/9': 'lipedema_um_dia',
        '0/9': 'lipedema_dia',
        '0/20': 'lipedema_ao_vivo',
        '-1/9': 'lipedema_replay1',
        '-1/18': 'lipedema_replay2',
        '-2/13': 'lipedema_chamada',
        '-3/9': 'lipedema_melhores_momentos1',
        '-4/9': 'lipedema_melhores_momentos2',
        '-5/9': 'lipedema_encerra_hoje',
        '-5/19': 'lipedema_ultima_chamada'
    }

    return messages[key] || 'Mensagem não encontrada'
}
