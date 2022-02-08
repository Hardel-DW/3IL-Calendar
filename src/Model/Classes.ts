export class Classe {

    public type: string;
    public hour: string|null;
    public day: string|null;
    public date: Date;
    public edtData: string|null;
    public classesTitle: string|null;
    public roomNumber: string|null;
    public weekNumber: number;
    public static allClasse: Array<Classe> = new Array<Classe>();

    constructor(type: string, hour: string|null, day: string|null, date: Date, edtData: string|null, classesTitle: string|null, roomNumber: string|null, weekNumber: number) {
        this.type = type;
        this.hour = hour;
        this.day = day;
        this.date = date;
        this.edtData = edtData;
        this.classesTitle = classesTitle;
        this.roomNumber = roomNumber;
        this.weekNumber = weekNumber;
        Classe.allClasse.push(this);
    }

    public getAllClasseByDay(datePassed: Date): Array<Classe> {
        let classeByDay: Array<Classe> = new Array<Classe>();

        for (const classe of Classe.allClasse)
            if (datePassed.isSameDate(classe.date))
                classeByDay.push(classe);

        return classeByDay;
    }

    public getAllClasseByWeek(weekNumber: number): Array<Classe> {
        let classeByWeek: Array<Classe> = new Array<Classe>();

        for (const classe of Classe.allClasse)
            if (classe.weekNumber == weekNumber)
                classeByWeek.push(classe);

        return classeByWeek;
    }

    public getAllClasseByRoom(roomNumber: string): Array<Classe> {
        let classeByRoom: Array<Classe> = new Array<Classe>();

        for (const classe of Classe.allClasse)
            if (classe.roomNumber == roomNumber)
                classeByRoom.push(classe);

        return classeByRoom;
    }
}