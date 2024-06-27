import { Injectable } from '@angular/core';
import { GeneralData } from '../Models/generalData';
import { CharacterInfo, CharacterData } from '../Models/characterData';
import { FlameData, FlameValues , Flame } from '../Models/flameData';
import { ArcaneSymbolData, SacredSymbolData } from '../Models/symbolData';
import DailiesJson from '../../../../../assets/Games/Maplestory/DailiesV2.json';
import WeekliesJson from '../../../../../assets/Games/Maplestory/WeekliesV2.json';

@Injectable({
    providedIn: 'root',
})

export class GeneralDataService {
    initiateDataSet() {
        var newGeneralData: GeneralData = {
            mapleRegion: { resetUtcOffset: 0, name: 'GMS' },
            selectedCharacterIndex: 0,
            nextCharacterIndex: 0,
            characters: [],
            trackerInfo: { 
                dailyVersion: DailiesJson.version,
                weeklyVersion: WeekliesJson.version, 
                lastDailyTrackerVisit: Date.now().toString(),
                lastWeeklyTrackerVisit: Date.now().toString(),
                dailyInfoVisible: false,
                weeklyInfoVisible: false,
                dailyImagePrefix: DailiesJson.imagePrefix,
                weeklyImagePrefix: WeekliesJson.imagePrefix
            }
        };

        for (let i = 0; i < 4; i++) {
            newGeneralData = this.addCharacter(newGeneralData);
        };

        return newGeneralData
    }

    addCharacter(data: GeneralData) {
        var newCharacterInfo: CharacterInfo = {
            characterName: "Character " + (data.characters.length + 1),
            characterStorageReference: "character" + data.nextCharacterIndex
        };

        // stringify and parse to ensure the data is passed by value not by reference
        // without this all newly added characters would be a reference of eachother
        data.characters.push(JSON.parse(JSON.stringify(newCharacterInfo)));
        data.nextCharacterIndex = data.nextCharacterIndex + 1;

        var newCharacterData = this.createCharacterSaveData();

        // update the generalData object
        localStorage.setItem("generalData", JSON.stringify(data));
        // create the new character data object in local storage
        localStorage.setItem(newCharacterInfo.characterStorageReference, JSON.stringify(newCharacterData));

        return data;
    }

    createCharacterSaveData() {
        var newCharacterData: CharacterData = {
            dailyTaskGroups: DailiesJson.taskGroups,
            weeklyTaskGroups: WeekliesJson.taskGroups,
            arcaneSymbolData: this.generateArcaneSymbolData(),
            sacredSymbolData: this.generateSacredSymbolData(),
            flameData: this.generateFlameData()
        };

        return newCharacterData;
    }

    generateArcaneSymbolData() {
        var newArcaneSymbolData: ArcaneSymbolData = {
            vjLevel: 1,
            vjExp: 1,
            vjDailyQuest: true,
            vjReverseCity: false,
            vjErdaSpectrum: true,
            chuchuLevel: 1,
            chuchuExp: 1,
            chuchuDailyQuest: true,
            chuchuYumYumIsland: false,
            chuchuHungryMuto: true,
            lachLevel: 1,
            lachExp: 1,
            lachDailyQuest: true,
            lachMidnightChaser: true,
            arcanaLevel: 1,
            arcanaExp: 1,
            arcanaDailyQuest: true,
            arcanaSpiritSaviour: true,
            morassLevel: 1,
            morassExp: 1,
            morassDailyQuest: true,
            moreassRanheimDefense: true,
            esferaLevel: 1,
            esferaExp: 1,
            esferaDailyQuest: true,
            esferaGuardian: true
        };

        return newArcaneSymbolData;
    }

    generateSacredSymbolData() {
        var newSacredSymbolData: SacredSymbolData = {
            cerniumLevel: 1,
            cerniumExp: 1,
            cerniumDailyQuest: true,
            arcusLevel: 1,
            arcusExp: 1,
            arcusDailyQuest: true,
            odiumLevel: 1,
            odiumExp: 1,
            odiumDailyQuest: true,
            shangrilaLevel: 1,
            shangrilaExp: 1,
            shangrilaDailyQuest: true,
            arteriaLevel: 1,
            arteriaExp: 1,
            arteriaDailyQuest: true,
            carcionLevel: 1,
            carcionExp: 1,
            carcionDailyQuest: true
        };

        return newSacredSymbolData;
    }

    generateFlameData() {
        var newFlame: Flame = {
            str: null,
            dex: null,
            luk: null,
            int: null,
            hp: null,
            mp: null,
            att: null,
            matt: null,
            allstat: null
        };

        var newFlameValues: FlameValues = {
            hat: newFlame,
            top: newFlame,
            belt: newFlame,
            bottom: newFlame,
            shoes: newFlame,
            gloves: newFlame,
            cape: newFlame,
            shoulder: newFlame,
            pocket: newFlame,
            pendant1: newFlame,
            pendant2: newFlame,
            face: newFlame,
            eye: newFlame,
            earrings: newFlame,
            extra1: newFlame,
            extra2: newFlame,
            extra3: newFlame,
            extra4: newFlame,
            extra5: newFlame
        };

        var newFlameData: FlameData = {
            selectedClassIndex: 3,
            mainStatMultiplier: 0,
            secondaryStatMultiplier: 0,
            hpMpMultiplier: 0,
            attMattMultiplier: 0,
            allstatMultiplier: 0,
            xenonAllstatMultiplier: 0,
            lukDoubleSecondaryAllStatMultiplier: 0,
            flameValues: newFlameValues
        };

        return newFlameData;
    }

}
