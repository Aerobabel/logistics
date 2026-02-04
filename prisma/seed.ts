import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // 1. Managers
    const managers = [
        { name: 'Иванов Иван Иванович', role: 'Старший менеджер по продажам', avatar: 'ИИИ', avatarColor: 'bg-orange-400', status: 'Active', contractsCount: 24, tonnage: 4500, farmsCount: 15, shipmentsTotal: 157, shipmentsActive: 12, efficiency: 112, rating: 4.8, planExecution: 112, sum: '125.0M ₽', avgPrice: '16 500 ₽' },
        { name: 'Петрова Анна Сергеевна', role: 'Менеджер по закупкам', avatar: 'ПАС', avatarColor: 'bg-yellow-400', status: 'Active', contractsCount: 18, tonnage: 3200, farmsCount: 12, shipmentsTotal: 106, shipmentsActive: 8, efficiency: 95, rating: 4.5, planExecution: 95, sum: '89.0M ₽', avgPrice: '15 800 ₽' },
        { name: 'Сидоров Сергей Петрович', role: 'Менеджер по логистике', avatar: 'ССП', avatarColor: 'bg-amber-400', status: 'Active', contractsCount: 15, tonnage: 2800, farmsCount: 9, shipmentsTotal: 202, shipmentsActive: 15, efficiency: 102, rating: 4.7, planExecution: 102, sum: '72.0M ₽', avgPrice: '14 200 ₽' },
        { name: 'Морозова Елена Викторовна', role: 'Менеджер по работе с клиентами', avatar: 'МЕВ', avatarColor: 'bg-orange-300', status: 'Vacation', contractsCount: 12, tonnage: 1800, farmsCount: 8, shipmentsTotal: 81, shipmentsActive: 5, efficiency: 88, rating: 4.2, planExecution: 88, sum: '58.0M ₽', avgPrice: '15 000 ₽' },
        { name: 'Козлов Александр Михайлович', role: 'Менеджер по экспорту', avatar: 'КАМ', avatarColor: 'bg-amber-500', status: 'Active', contractsCount: 9, tonnage: 5200, farmsCount: 6, shipmentsTotal: 82, shipmentsActive: 28, efficiency: 118, rating: 4.9, planExecution: 118, sum: '156.0M ₽', avgPrice: '17 200 ₽' },
    ]

    for (const manager of managers) {
        await prisma.manager.create({ data: manager })
    }

    // 2. Counterparties
    const counterparties = [
        { name: 'ООО "АгроТрейд"', inn: '3664069397', kpp: '366401001', address: 'г. Воронеж, ул. Ленина, 45', status: 'ACTIVE', trustRating: 98, phone: '+7 (473) 234-56-78', email: 'info@agrotrade.ru', contactPerson: 'Иванов И.И.', type: 'Client' },
        { name: 'ЗАО "ЗерноЭкспорт"', inn: '7705638290', kpp: '770501001', address: 'г. Москва, наб. Пресненская, 10', status: 'ACTIVE', trustRating: 95, phone: '+7 (495) 123-45-67', email: 'contact@zernoexport.ru', contactPerson: 'Петров П.П.', type: 'Buyer' },
        { name: 'ИП Петров А.С.', inn: '366214567890', address: 'Воронежская обл., с. Новая Усмань', status: 'CHECKING', trustRating: 85, phone: '+7 (910) 123-45-67', email: 'petrov@mail.ru', contactPerson: 'Петров А.С.', type: 'Carrier' },
        { name: 'ООО "Урожай+"', inn: '3123654789', kpp: '312301001', address: 'Белгородская обл., г. Старый Оскол', status: 'ACTIVE', trustRating: 92, phone: '+7 (4725) 12-34-56', email: 'sales@urozhay.ru', contactPerson: 'Сидоров С.С.', type: 'Supplier' },
        { name: 'ЗАО "ГлобалГрейн"', inn: '2315678901', kpp: '231501001', address: 'Краснодарский край, г. Новороссийск', status: 'BLOCKED', trustRating: 40, phone: '+7 (8617) 12-34-56', email: 'info@globalgrain.ru', contactPerson: 'Смирнов А.А.', type: 'Buyer' },
    ]

    for (const cp of counterparties) {
        await prisma.counterparty.create({ data: cp })
    }

    // 3. Vehicles
    const vehicles = [
        { plate: 'A 123 AA 36', driver: 'Иванов И.И.', type: 'Зерновоз 20т', status: 'AVAILABLE' },
        { plate: 'B 456 BB 36', driver: 'Петров П.П.', type: 'Самосвал 15т', status: 'BUSY' },
        { plate: 'C 789 CC 77', driver: 'Сидоров С.С.', type: 'Бортовой 10т', status: 'AVAILABLE' },
        { plate: 'E 111 KX 99', driver: 'Смирнов А.А.', type: 'Тонар 30т', status: 'REPAIR' },
    ]

    for (const v of vehicles) {
        await prisma.vehicle.create({ data: v })
    }

    // 4. Requests
    await prisma.request.create({
        data: {
            date: new Date('2026-01-20'),
            cargo: 'Пшеница 3 класс',
            weight: 25,
            routeFrom: 'Воронеж',
            routeTo: 'Новороссийск',
            clientName: 'ООО "АгроТрейд"',
            status: 'PENDING',
            cost: 45000
        }
    })

    await prisma.request.create({
        data: {
            date: new Date('2026-01-21'),
            cargo: 'Кукуруза',
            weight: 20,
            routeFrom: 'Старый Оскол',
            routeTo: 'Ростов-на-Дону',
            clientName: 'ООО "Урожай+"',
            status: 'ASSIGNED',
            cost: 38000
        }
    })

    console.log('Seeding completed.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
