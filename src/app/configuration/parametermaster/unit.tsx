const units = [
    {
        "row": 1,
        "ucum_code": "10.L\/min",
        "description": "10 liter per minute",
        "statusFlag": 1
    },
    {
        "row": 2,
        "ucum_code": "10.L\/(min.m2)",
        "description": "10 liter per minute per square meter",
        "statusFlag": 1
    },
    {
        "row": 3,
        "ucum_code": "10.uN.s\/(cm5.m2)",
        "description": "10 micronewton second per centimeter to the fifth power per square meter",
        "statusFlag": 1
    },
    {
        "row": 4,
        "ucum_code": "10*4\/uL",
        "description": "10 thousand per microliter",
        "statusFlag": 1
    },
    {
        "row": 5,
        "ucum_code": "10*8",
        "description": "100 million ",
        "statusFlag": 1
    },
    {
        "row": 6,
        "ucum_code": "24.h",
        "description": "24 hour",
        "statusFlag": 1
    },
    {
        "row": 7,
        "ucum_code": "{absorbance}",
        "description": "absorbance",
        "statusFlag": 1
    },
    {
        "row": 8,
        "ucum_code": "{activity}",
        "description": "activity",
        "statusFlag": 1
    },
    {
        "row": 9,
        "ucum_code": "[AU]",
        "description": "allergy unit",
        "statusFlag": 1
    },
    {
        "row": 10,
        "ucum_code": "{AHF'U}",
        "description": "American Hospital Formulary unit",
        "statusFlag": 1
    },
    {
        "row": 11,
        "ucum_code": "A",
        "description": "ampere",
        "statusFlag": 1
    },
    {
        "row": 12,
        "ucum_code": "A\/m",
        "description": "ampere per meter",
        "statusFlag": 1
    },
    {
        "row": 13,
        "ucum_code": "[arb'U]",
        "description": "arbitrary unit",
        "statusFlag": 1
    },
    {
        "row": 14,
        "ucum_code": "[arb'U]\/mL",
        "description": "arbitrary unit per milliliter",
        "statusFlag": 1
    },
    {
        "row": 15,
        "ucum_code": "{ARU}",
        "description": "aspirin response unit",
        "statusFlag": 1
    },
    {
        "row": 16,
        "ucum_code": "atm",
        "description": "atmosphere",
        "statusFlag": 1
    },
    {
        "row": 17,
        "ucum_code": "ag\/{cell}",
        "description": "attogram per cell",
        "statusFlag": 1
    },
    {
        "row": 18,
        "ucum_code": "bar",
        "description": "bar",
        "statusFlag": 1
    },
    {
        "row": 19,
        "ucum_code": "Bq",
        "description": "Becquerel",
        "statusFlag": 1
    },
    {
        "row": 20,
        "ucum_code": "[beth'U]",
        "description": "Bethesda unit",
        "statusFlag": 1
    },
    {
        "row": 21,
        "ucum_code": "10*9\/L",
        "description": "billion per liter",
        "statusFlag": 1
    },
    {
        "row": 22,
        "ucum_code": "10*9\/uL",
        "description": "billion per microliter",
        "statusFlag": 1
    },
    {
        "row": 23,
        "ucum_code": "10*9\/mL",
        "description": "billion per milliliter",
        "statusFlag": 1
    },
    {
        "row": 24,
        "ucum_code": "{binding_index}",
        "description": "binding index",
        "statusFlag": 1
    },
    {
        "row": 25,
        "ucum_code": "[bdsk'U]",
        "description": "Bodansky unit",
        "statusFlag": 1
    },
    {
        "row": 26,
        "ucum_code": "{breaths}\/min",
        "description": "breaths per minute",
        "statusFlag": 1
    },
    {
        "row": 27,
        "ucum_code": "{CAG_repeats}",
        "description": "CAG trinucleotide repeats",
        "statusFlag": 1
    },
    {
        "row": 28,
        "ucum_code": "cal",
        "description": "calorie",
        "statusFlag": 1
    },
    {
        "row": 29,
        "ucum_code": "{cells}",
        "description": "cells",
        "statusFlag": 1
    },
    {
        "row": 30,
        "ucum_code": "{cells}\/[HPF]",
        "description": "cells per high power field",
        "statusFlag": 1
    },
    {
        "row": 31,
        "ucum_code": "{cells}\/uL",
        "description": "cells per microliter",
        "statusFlag": 1
    },
    {
        "row": 32,
        "ucum_code": "cg",
        "description": "centigram",
        "statusFlag": 1
    },
    {
        "row": 33,
        "ucum_code": "cL",
        "description": "centiliter",
        "statusFlag": 1
    },
    {
        "row": 34,
        "ucum_code": "cm",
        "description": "centimeter",
        "statusFlag": 1
    },
    {
        "row": 35,
        "ucum_code": "cm[Hg]",
        "description": "centimeter of mercury",
        "statusFlag": 1
    },
    {
        "row": 36,
        "ucum_code": "cm[H2O]",
        "description": "centimeter of water",
        "statusFlag": 1
    },
    {
        "row": 37,
        "ucum_code": "cm[H2O]\/L\/s",
        "description": "centimeter of water per liter per second",
        "statusFlag": 1
    },
    {
        "row": 38,
        "ucum_code": "cm[H2O]\/s\/m",
        "description": "centimeter of water per second per meter",
        "statusFlag": 1
    },
    {
        "row": 39,
        "ucum_code": "cm\/s",
        "description": "centimeter per second",
        "statusFlag": 1
    },
    {
        "row": 40,
        "ucum_code": "cP",
        "description": "centipoise",
        "statusFlag": 1
    },
    {
        "row": 41,
        "ucum_code": "cSt",
        "description": "centistoke",
        "statusFlag": 1
    },
    {
        "row": 42,
        "ucum_code": "{delta_OD}",
        "description": "change in (delta) optical density",
        "statusFlag": 1
    },
    {
        "row": 43,
        "ucum_code": "{clock_time}",
        "description": "clock time e.g 12:30PM",
        "statusFlag": 1
    },
    {
        "row": 44,
        "ucum_code": "[CFU]",
        "description": "colony forming unit",
        "statusFlag": 1
    },
    {
        "row": 45,
        "ucum_code": "[CFU]\/L",
        "description": "colony forming unit per liter",
        "statusFlag": 1
    },
    {
        "row": 46,
        "ucum_code": "[CFU]\/mL",
        "description": "colony forming unit per milliliter",
        "statusFlag": 1
    },
    {
        "row": 47,
        "ucum_code": "{CAE'U}",
        "description": "complement activity enzyme unit",
        "statusFlag": 1
    },
    {
        "row": 48,
        "ucum_code": "{CH100'U}",
        "description": "complement CH100 unit",
        "statusFlag": 1
    },
    {
        "row": 49,
        "ucum_code": "{copies}",
        "description": "copies",
        "statusFlag": 1
    },
    {
        "row": 50,
        "ucum_code": "{copies}\/ug",
        "description": "copies per microgram",
        "statusFlag": 1
    },
    {
        "row": 51,
        "ucum_code": "{copies}\/mL",
        "description": "copies per milliliter",
        "statusFlag": 1
    },
    {
        "row": 52,
        "ucum_code": "{count}",
        "description": "count",
        "statusFlag": 1
    },
    {
        "row": 53,
        "ucum_code": "{CPM}",
        "description": "counts per minute",
        "statusFlag": 1
    },
    {
        "row": 54,
        "ucum_code": "{CPM}\/10*3{cell}",
        "description": "counts per minute per thousand cells",
        "statusFlag": 1
    },
    {
        "row": 55,
        "ucum_code": "cm3",
        "description": "cubic centimeter",
        "statusFlag": 1
    },
    {
        "row": 56,
        "ucum_code": "[cin_i]",
        "description": "cubic inch (international)",
        "statusFlag": 1
    },
    {
        "row": 57,
        "ucum_code": "m3\/s",
        "description": "cubic meter per second",
        "statusFlag": 1
    },
    {
        "row": 58,
        "ucum_code": "{Ct_value}",
        "description": "Cycle threshold value",
        "statusFlag": 1
    },
    {
        "row": 59,
        "ucum_code": "d",
        "description": "day",
        "statusFlag": 1
    },
    {
        "row": 60,
        "ucum_code": "d\/(7.d)",
        "description": "day per 7 day",
        "statusFlag": 1
    },
    {
        "row": 61,
        "ucum_code": "d\/wk",
        "description": "days per week",
        "statusFlag": 1
    },
    {
        "row": 62,
        "ucum_code": "dB",
        "description": "decibel",
        "statusFlag": 1
    },
    {
        "row": 63,
        "ucum_code": "dg",
        "description": "decigram",
        "statusFlag": 1
    },
    {
        "row": 64,
        "ucum_code": "dL",
        "description": "deciliter",
        "statusFlag": 1
    },
    {
        "row": 65,
        "ucum_code": "dm",
        "description": "decimeter",
        "statusFlag": 1
    },
    {
        "row": 66,
        "ucum_code": "deg",
        "description": "degree (plane angle)",
        "statusFlag": 1
    },
    {
        "row": 67,
        "ucum_code": "Cel",
        "description": "degree Celsius",
        "statusFlag": 1
    },
    {
        "row": 68,
        "ucum_code": "[degF]",
        "description": "degree Fahrenheit",
        "statusFlag": 1
    },
    {
        "row": 69,
        "ucum_code": "K",
        "description": "degree Kelvin",
        "statusFlag": 1
    },
    {
        "row": 70,
        "ucum_code": "K\/W",
        "description": "degree Kelvin per Watt",
        "statusFlag": 1
    },
    {
        "row": 71,
        "ucum_code": "deg\/s",
        "description": "degree per second",
        "statusFlag": 1
    },
    {
        "row": 72,
        "ucum_code": "daL\/min",
        "description": "dekaliter per minute",
        "statusFlag": 1
    },
    {
        "row": 73,
        "ucum_code": "daL\/min\/m2",
        "description": "dekaliter per minute per square meter",
        "statusFlag": 1
    },
    {
        "row": 74,
        "ucum_code": "{dilution}",
        "description": "dilution",
        "statusFlag": 1
    },
    {
        "row": 75,
        "ucum_code": "[diop]",
        "description": "diopter",
        "statusFlag": 1
    },
    {
        "row": 76,
        "ucum_code": "[dr_av]",
        "description": "dram  (US and British)",
        "statusFlag": 1
    },
    {
        "row": 77,
        "ucum_code": "[drp]",
        "description": "drop (1\/12 milliliter)",
        "statusFlag": 1
    },
    {
        "row": 78,
        "ucum_code": "dyn.s\/cm",
        "description": "dyne second per centimeter",
        "statusFlag": 1
    },
    {
        "row": 79,
        "ucum_code": "dyn.s\/(cm.m2)",
        "description": "dyne second per centimeter per square meter",
        "statusFlag": 1
    },
    {
        "row": 80,
        "ucum_code": "{Ehrlich'U}",
        "description": "Ehrlich unit",
        "statusFlag": 1
    },
    {
        "row": 81,
        "ucum_code": "{Ehrlich'U}\/100.g",
        "description": "Ehrlich unit per 100 gram",
        "statusFlag": 1
    },
    {
        "row": 82,
        "ucum_code": "{Ehrlich'U}\/(2.h)",
        "description": "Ehrlich unit per 2 hour",
        "statusFlag": 1
    },
    {
        "row": 83,
        "ucum_code": "{Ehrlich'U}\/d",
        "description": "Ehrlich unit per day",
        "statusFlag": 1
    },
    {
        "row": 84,
        "ucum_code": "{Ehrlich'U}\/dL",
        "description": "Ehrlich unit per deciliter",
        "statusFlag": 1
    },
    {
        "row": 85,
        "ucum_code": "{EIA_index}",
        "description": "EIA index",
        "statusFlag": 1
    },
    {
        "row": 86,
        "ucum_code": "{EIA_titer}",
        "description": "EIA titer",
        "statusFlag": 1
    },
    {
        "row": 87,
        "ucum_code": "{EIA'U}",
        "description": "EIA unit",
        "statusFlag": 1
    },
    {
        "row": 88,
        "ucum_code": "{EIA'U}\/U",
        "description": "EIA unit per enzyme unit",
        "statusFlag": 1
    },
    {
        "row": 89,
        "ucum_code": "{EV}",
        "description": "EIA value",
        "statusFlag": 1
    },
    {
        "row": 90,
        "ucum_code": "eV",
        "description": "electron Volt",
        "statusFlag": 1
    },
    {
        "row": 91,
        "ucum_code": "{ELISA'U}",
        "description": "ELISA unit",
        "statusFlag": 1
    },
    {
        "row": 92,
        "ucum_code": "U",
        "description": "enzyme unit",
        "statusFlag": 1
    },
    {
        "row": 93,
        "ucum_code": "U\/10",
        "description": "enzyme unit per 10",
        "statusFlag": 1
    },
    {
        "row": 94,
        "ucum_code": "U\/10*10",
        "description": "enzyme unit per 10 billion",
        "statusFlag": 1
    },
    {
        "row": 95,
        "ucum_code": "U\/10*10{cells}",
        "description": "enzyme unit per 10 billion cells",
        "statusFlag": 1
    },
    {
        "row": 96,
        "ucum_code": "U\/(10.g){feces}",
        "description": "enzyme unit per 10 gram of feces",
        "statusFlag": 1
    },
    {
        "row": 97,
        "ucum_code": "U\/(12.h)",
        "description": "enzyme unit per 12 hour",
        "statusFlag": 1
    },
    {
        "row": 98,
        "ucum_code": "U\/(2.h)",
        "description": "enzyme unit per 2 hour",
        "statusFlag": 1
    },
    {
        "row": 99,
        "ucum_code": "U\/(24.h)",
        "description": "enzyme unit per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 100,
        "ucum_code": "U\/10*9",
        "description": "enzyme unit per billion",
        "statusFlag": 1
    },
    {
        "row": 101,
        "ucum_code": "U\/d",
        "description": "enzyme unit per day",
        "statusFlag": 1
    },
    {
        "row": 102,
        "ucum_code": "U\/dL",
        "description": "enzyme unit per deciliter",
        "statusFlag": 1
    },
    {
        "row": 103,
        "ucum_code": "U\/g",
        "description": "enzyme unit per gram",
        "statusFlag": 1
    },
    {
        "row": 104,
        "ucum_code": "U\/g{creat}",
        "description": "enzyme unit per gram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 105,
        "ucum_code": "U\/g{Hb}",
        "description": "enzyme unit per gram of hemoglobin",
        "statusFlag": 1
    },
    {
        "row": 106,
        "ucum_code": "U\/g{protein}",
        "description": "enzyme unit per gram of protein",
        "statusFlag": 1
    },
    {
        "row": 107,
        "ucum_code": "U\/h",
        "description": "enzyme unit per hour",
        "statusFlag": 1
    },
    {
        "row": 108,
        "ucum_code": "U\/kg{Hb}",
        "description": "enzyme unit per kilogram of hemoglobin",
        "statusFlag": 1
    },
    {
        "row": 109,
        "ucum_code": "U\/L",
        "description": "enzyme unit per liter",
        "statusFlag": 1
    },
    {
        "row": 110,
        "ucum_code": "U{25Cel}\/L",
        "description": "enzyme unit per liter at 25 deg Celsius ",
        "statusFlag": 1
    },
    {
        "row": 111,
        "ucum_code": "U{37Cel}\/L",
        "description": "enzyme unit per liter at 37 deg Celsius",
        "statusFlag": 1
    },
    {
        "row": 112,
        "ucum_code": "U\/mL",
        "description": "enzyme unit per milliliter",
        "statusFlag": 1
    },
    {
        "row": 113,
        "ucum_code": "U\/mL{RBCs}",
        "description": "enzyme unit per milliliter of red blood cells",
        "statusFlag": 1
    },
    {
        "row": 114,
        "ucum_code": "U\/mmol{creat}",
        "description": "enzyme unit per millimole of creatinine",
        "statusFlag": 1
    },
    {
        "row": 115,
        "ucum_code": "U\/10*6",
        "description": "enzyme unit per million",
        "statusFlag": 1
    },
    {
        "row": 116,
        "ucum_code": "U\/min",
        "description": "enzyme unit per minute",
        "statusFlag": 1
    },
    {
        "row": 117,
        "ucum_code": "U\/s",
        "description": "enzyme unit per second",
        "statusFlag": 1
    },
    {
        "row": 118,
        "ucum_code": "U\/10*12",
        "description": "enzyme unit per trillion",
        "statusFlag": 1
    },
    {
        "row": 119,
        "ucum_code": "U\/10*12{RBCs}",
        "description": "enzyme unit per trillion red blood cells",
        "statusFlag": 1
    },
    {
        "row": 120,
        "ucum_code": "eq",
        "description": "equivalent",
        "statusFlag": 1
    },
    {
        "row": 121,
        "ucum_code": "eq\/L",
        "description": "equivalent per liter",
        "statusFlag": 1
    },
    {
        "row": 122,
        "ucum_code": "eq\/umol",
        "description": "equivalent per micromole",
        "statusFlag": 1
    },
    {
        "row": 123,
        "ucum_code": "eq\/mL",
        "description": "equivalent per milliliter",
        "statusFlag": 1
    },
    {
        "row": 124,
        "ucum_code": "eq\/mmol",
        "description": "equivalent per millimole",
        "statusFlag": 1
    },
    {
        "row": 125,
        "ucum_code": "erg",
        "description": "erg",
        "statusFlag": 1
    },
    {
        "row": 126,
        "ucum_code": "F",
        "description": "Farad",
        "statusFlag": 1
    },
    {
        "row": 127,
        "ucum_code": "[ft_us]\/[ft_us]",
        "description": "feet (US) per feet (US)",
        "statusFlag": 1
    },
    {
        "row": 128,
        "ucum_code": "fg",
        "description": "femtogram",
        "statusFlag": 1
    },
    {
        "row": 129,
        "ucum_code": "fL",
        "description": "femtoliter",
        "statusFlag": 1
    },
    {
        "row": 130,
        "ucum_code": "fm",
        "description": "femtometer",
        "statusFlag": 1
    },
    {
        "row": 131,
        "ucum_code": "fmol",
        "description": "femtomole",
        "statusFlag": 1
    },
    {
        "row": 132,
        "ucum_code": "fmol\/g",
        "description": "femtomole per gram",
        "statusFlag": 1
    },
    {
        "row": 133,
        "ucum_code": "fmol\/L",
        "description": "femtomole per liter",
        "statusFlag": 1
    },
    {
        "row": 134,
        "ucum_code": "fmol\/mg",
        "description": "femtomole per milligram",
        "statusFlag": 1
    },
    {
        "row": 135,
        "ucum_code": "fmol\/mg{cyt_prot}",
        "description": "femtomole per milligram of cytosol protein",
        "statusFlag": 1
    },
    {
        "row": 136,
        "ucum_code": "fmol\/mg{prot}",
        "description": "femtomole per milligram of protein",
        "statusFlag": 1
    },
    {
        "row": 137,
        "ucum_code": "fmol\/mL",
        "description": "femtomole per milliliter",
        "statusFlag": 1
    },
    {
        "row": 138,
        "ucum_code": "[foz_us]",
        "description": "fluid ounce (US)",
        "statusFlag": 1
    },
    {
        "row": 139,
        "ucum_code": "{FIU}",
        "description": "fluorescent intensity unit",
        "statusFlag": 1
    },
    {
        "row": 140,
        "ucum_code": "[ft_i]",
        "description": "foot (international)",
        "statusFlag": 1
    },
    {
        "row": 141,
        "ucum_code": "{fraction}",
        "description": "fraction",
        "statusFlag": 1
    },
    {
        "row": 142,
        "ucum_code": "[Ch]",
        "description": "French (catheter gauge) ",
        "statusFlag": 1
    },
    {
        "row": 143,
        "ucum_code": "{GAA_repeats}",
        "description": "GAA trinucleotide repeats",
        "statusFlag": 1
    },
    {
        "row": 144,
        "ucum_code": "[gal_us]",
        "description": "gallon (US)",
        "statusFlag": 1
    },
    {
        "row": 145,
        "ucum_code": "{genomes}\/mL",
        "description": "genomes per milliliter",
        "statusFlag": 1
    },
    {
        "row": 146,
        "ucum_code": "{Globules}\/[HPF]",
        "description": "globules (drops)  per high power field",
        "statusFlag": 1
    },
    {
        "row": 147,
        "ucum_code": "g",
        "description": "gram",
        "statusFlag": 1
    },
    {
        "row": 148,
        "ucum_code": "g.m",
        "description": "gram meter",
        "statusFlag": 1
    },
    {
        "row": 149,
        "ucum_code": "g.m\/{beat}",
        "description": "gram meter per heart beat ",
        "statusFlag": 1
    },
    {
        "row": 150,
        "ucum_code": "g{creat}",
        "description": "gram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 151,
        "ucum_code": "g{Hb}",
        "description": "gram of hemoglobin",
        "statusFlag": 1
    },
    {
        "row": 152,
        "ucum_code": "g{total_nit}",
        "description": "gram of total nitrogen",
        "statusFlag": 1
    },
    {
        "row": 153,
        "ucum_code": "g{total_prot}",
        "description": "gram of total protein",
        "statusFlag": 1
    },
    {
        "row": 154,
        "ucum_code": "g{wet_tissue}",
        "description": "gram of wet tissue",
        "statusFlag": 1
    },
    {
        "row": 155,
        "ucum_code": "g\/kg\/(8.h)",
        "description": "gram per  kilogram per 8 hour ",
        "statusFlag": 1
    },
    {
        "row": 156,
        "ucum_code": "g\/(100.g)",
        "description": "gram per 100 gram",
        "statusFlag": 1
    },
    {
        "row": 157,
        "ucum_code": "g\/(12.h)",
        "description": "gram per 12 hour",
        "statusFlag": 1
    },
    {
        "row": 158,
        "ucum_code": "g\/(24.h)",
        "description": "gram per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 159,
        "ucum_code": "g\/(3.d)",
        "description": "gram per 3 days",
        "statusFlag": 1
    },
    {
        "row": 160,
        "ucum_code": "g\/(4.h)",
        "description": "gram per 4 hour",
        "statusFlag": 1
    },
    {
        "row": 161,
        "ucum_code": "g\/(48.h)",
        "description": "gram per 48 hour",
        "statusFlag": 1
    },
    {
        "row": 162,
        "ucum_code": "g\/(5.h)",
        "description": "gram per 5 hour",
        "statusFlag": 1
    },
    {
        "row": 163,
        "ucum_code": "g\/(6.h)",
        "description": "gram per 6 hour",
        "statusFlag": 1
    },
    {
        "row": 164,
        "ucum_code": "g\/(72.h)",
        "description": "gram per 72 hour",
        "statusFlag": 1
    },
    {
        "row": 165,
        "ucum_code": "g\/(8.h){shift}",
        "description": "gram per 8 hour shift",
        "statusFlag": 1
    },
    {
        "row": 166,
        "ucum_code": "g\/cm3",
        "description": "gram per cubic centimeter",
        "statusFlag": 1
    },
    {
        "row": 167,
        "ucum_code": "g\/d",
        "description": "gram per day",
        "statusFlag": 1
    },
    {
        "row": 168,
        "ucum_code": "g\/dL",
        "description": "gram per deciliter",
        "statusFlag": 1
    },
    {
        "row": 169,
        "ucum_code": "g\/g",
        "description": "gram per gram",
        "statusFlag": 1
    },
    {
        "row": 170,
        "ucum_code": "g\/g{creat}",
        "description": "gram per gram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 171,
        "ucum_code": "g\/g{globulin}",
        "description": "gram per gram of globulin",
        "statusFlag": 1
    },
    {
        "row": 172,
        "ucum_code": "g\/g{tissue}",
        "description": "gram per gram of tissue",
        "statusFlag": 1
    },
    {
        "row": 173,
        "ucum_code": "g\/h",
        "description": "gram per hour",
        "statusFlag": 1
    },
    {
        "row": 174,
        "ucum_code": "g\/h\/m2",
        "description": "gram per hour per square meter",
        "statusFlag": 1
    },
    {
        "row": 175,
        "ucum_code": "g\/kg",
        "description": "gram per kilogram",
        "statusFlag": 1
    },
    {
        "row": 176,
        "ucum_code": "g\/kg\/(8.h){shift}",
        "description": "gram per kilogram per 8 hour shift",
        "statusFlag": 1
    },
    {
        "row": 177,
        "ucum_code": "g\/kg\/d",
        "description": "gram per kilogram per day",
        "statusFlag": 1
    },
    {
        "row": 178,
        "ucum_code": "g\/kg\/h",
        "description": "gram per kilogram per hour",
        "statusFlag": 1
    },
    {
        "row": 179,
        "ucum_code": "g\/kg\/min",
        "description": "gram per kilogram per minute",
        "statusFlag": 1
    },
    {
        "row": 180,
        "ucum_code": "g\/L",
        "description": "gram per liter",
        "statusFlag": 1
    },
    {
        "row": 181,
        "ucum_code": "g\/mg",
        "description": "gram per milligram",
        "statusFlag": 1
    },
    {
        "row": 182,
        "ucum_code": "g\/mL",
        "description": "gram per milliliter",
        "statusFlag": 1
    },
    {
        "row": 183,
        "ucum_code": "g\/mmol",
        "description": "gram per millimole",
        "statusFlag": 1
    },
    {
        "row": 184,
        "ucum_code": "g\/min",
        "description": "gram per minute",
        "statusFlag": 1
    },
    {
        "row": 185,
        "ucum_code": "g\/mol{creat}",
        "description": "gram per mole of creatinine",
        "statusFlag": 1
    },
    {
        "row": 186,
        "ucum_code": "g\/{specimen}",
        "description": "gram per specimen",
        "statusFlag": 1
    },
    {
        "row": 187,
        "ucum_code": "g\/cm2",
        "description": "gram per square centimeter",
        "statusFlag": 1
    },
    {
        "row": 188,
        "ucum_code": "g\/m2",
        "description": "gram per square meter",
        "statusFlag": 1
    },
    {
        "row": 189,
        "ucum_code": "g\/{total_output}",
        "description": "gram per total output",
        "statusFlag": 1
    },
    {
        "row": 190,
        "ucum_code": "g\/{total_weight}",
        "description": "gram per total weight",
        "statusFlag": 1
    },
    {
        "row": 191,
        "ucum_code": "Gy",
        "description": "Gray",
        "statusFlag": 1
    },
    {
        "row": 192,
        "ucum_code": "{beats}\/min",
        "description": "heart beats per minute",
        "statusFlag": 1
    },
    {
        "row": 193,
        "ucum_code": "H",
        "description": "Henry",
        "statusFlag": 1
    },
    {
        "row": 194,
        "ucum_code": "Hz",
        "description": "Hertz",
        "statusFlag": 1
    },
    {
        "row": 195,
        "ucum_code": "[HPF]",
        "description": "high power field",
        "statusFlag": 1
    },
    {
        "row": 196,
        "ucum_code": "h",
        "description": "hour",
        "statusFlag": 1
    },
    {
        "row": 197,
        "ucum_code": "h\/d",
        "description": "hour per day",
        "statusFlag": 1
    },
    {
        "row": 198,
        "ucum_code": "h\/wk",
        "description": "hour per week",
        "statusFlag": 1
    },
    {
        "row": 199,
        "ucum_code": "[APL'U]\/mL",
        "description": "IgA anticardiolipin unit per milliliter**",
        "statusFlag": 1
    },
    {
        "row": 200,
        "ucum_code": "[APL'U]",
        "description": "IgA anticardiolipin unit**",
        "statusFlag": 1
    },
    {
        "row": 201,
        "ucum_code": "{APS'U}",
        "description": "IgA antiphosphatidylserine unit ",
        "statusFlag": 1
    },
    {
        "row": 202,
        "ucum_code": "[GPL'U]\/mL",
        "description": "IgG anticardiolipin unit per milliliter**",
        "statusFlag": 1
    },
    {
        "row": 203,
        "ucum_code": "[GPL'U]",
        "description": "IgG anticardiolipin unit**",
        "statusFlag": 1
    },
    {
        "row": 204,
        "ucum_code": "{GPS'U}",
        "description": "IgG antiphosphatidylserine unit",
        "statusFlag": 1
    },
    {
        "row": 205,
        "ucum_code": "[MPL'U]\/mL",
        "description": "IgM anticardiolipin unit per milliliter**",
        "statusFlag": 1
    },
    {
        "row": 206,
        "ucum_code": "[MPL'U]",
        "description": "IgM anticardiolipin unit**",
        "statusFlag": 1
    },
    {
        "row": 207,
        "ucum_code": "{MPS'U}",
        "description": "IgM antiphosphatidylserine unit",
        "statusFlag": 1
    },
    {
        "row": 208,
        "ucum_code": "{MPS'U}\/mL",
        "description": "IgM antiphosphatidylserine unit per milliliter",
        "statusFlag": 1
    },
    {
        "row": 209,
        "ucum_code": "{ImmuneComplex'U}",
        "description": "immune complex unit",
        "statusFlag": 1
    },
    {
        "row": 210,
        "ucum_code": "{ISR}",
        "description": "immune status ratio",
        "statusFlag": 1
    },
    {
        "row": 211,
        "ucum_code": "{IFA_index}",
        "description": "immunofluorescence assay index",
        "statusFlag": 1
    },
    {
        "row": 212,
        "ucum_code": "{IFA_titer}",
        "description": "Immunofluorescence assay titer",
        "statusFlag": 1
    },
    {
        "row": 213,
        "ucum_code": "[in_i]",
        "description": "inch (international)",
        "statusFlag": 1
    },
    {
        "row": 214,
        "ucum_code": "[in_i'H2O]",
        "description": "inch (international) of water",
        "statusFlag": 1
    },
    {
        "row": 215,
        "ucum_code": "[in_us]",
        "description": "inches (US)",
        "statusFlag": 1
    },
    {
        "row": 216,
        "ucum_code": "{index_val}",
        "description": "index value",
        "statusFlag": 1
    },
    {
        "row": 217,
        "ucum_code": "{index}",
        "description": "index value",
        "statusFlag": 1
    },
    {
        "row": 218,
        "ucum_code": "{HA_titer}",
        "description": "influenza hemagglutination titer",
        "statusFlag": 1
    },
    {
        "row": 219,
        "ucum_code": "{INR}",
        "description": "international normalized ratio",
        "statusFlag": 1
    },
    {
        "row": 220,
        "ucum_code": "[IU]",
        "description": "international unit",
        "statusFlag": 1
    },
    {
        "row": 221,
        "ucum_code": "[IU]\/(2.h)",
        "description": "international unit per 2 hour",
        "statusFlag": 1
    },
    {
        "row": 222,
        "ucum_code": "[IU]\/(24.h)",
        "description": "international unit per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 223,
        "ucum_code": "[IU]\/10*9{RBCs}",
        "description": "international unit per billion red blood cells",
        "statusFlag": 1
    },
    {
        "row": 224,
        "ucum_code": "[IU]\/d",
        "description": "international unit per day",
        "statusFlag": 1
    },
    {
        "row": 225,
        "ucum_code": "[IU]\/dL",
        "description": "international unit per deciliter",
        "statusFlag": 1
    },
    {
        "row": 226,
        "ucum_code": "[IU]\/g",
        "description": "international unit per gram",
        "statusFlag": 1
    },
    {
        "row": 227,
        "ucum_code": "[IU]\/g{Hb}",
        "description": "international unit per gram of hemoglobin",
        "statusFlag": 1
    },
    {
        "row": 228,
        "ucum_code": "[IU]\/h",
        "description": "international unit per hour",
        "statusFlag": 1
    },
    {
        "row": 229,
        "ucum_code": "[IU]\/kg",
        "description": "international unit per kilogram",
        "statusFlag": 1
    },
    {
        "row": 230,
        "ucum_code": "[IU]\/kg\/d",
        "description": "international unit per kilogram per day",
        "statusFlag": 1
    },
    {
        "row": 231,
        "ucum_code": "[IU]\/L",
        "description": "international unit per liter",
        "statusFlag": 1
    },
    {
        "row": 232,
        "ucum_code": "[IU]\/L{37Cel}",
        "description": "international unit per liter at 37 degrees Celsius",
        "statusFlag": 1
    },
    {
        "row": 233,
        "ucum_code": "[IU]\/mg{creat}",
        "description": "international unit per milligram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 234,
        "ucum_code": "[IU]\/mL",
        "description": "international unit per milliliter",
        "statusFlag": 1
    },
    {
        "row": 235,
        "ucum_code": "[IU]\/min",
        "description": "international unit per minute",
        "statusFlag": 1
    },
    {
        "row": 236,
        "ucum_code": "J",
        "description": "joule",
        "statusFlag": 1
    },
    {
        "row": 237,
        "ucum_code": "J\/L",
        "description": "joule per liter",
        "statusFlag": 1
    },
    {
        "row": 238,
        "ucum_code": "{JDF'U}",
        "description": "Juvenile Diabetes Foundation unit",
        "statusFlag": 1
    },
    {
        "row": 239,
        "ucum_code": "{JDF'U}\/L",
        "description": "Juvenile Diabetes Foundation unit per liter",
        "statusFlag": 1
    },
    {
        "row": 240,
        "ucum_code": "{KCT'U}",
        "description": "kaolin clotting time",
        "statusFlag": 1
    },
    {
        "row": 241,
        "ucum_code": "kat",
        "description": "katal",
        "statusFlag": 1
    },
    {
        "row": 242,
        "ucum_code": "kat\/kg",
        "description": "katal per kilogram",
        "statusFlag": 1
    },
    {
        "row": 243,
        "ucum_code": "kat\/L",
        "description": "katal per liter",
        "statusFlag": 1
    },
    {
        "row": 244,
        "ucum_code": "kU",
        "description": "kilo enzyme unit",
        "statusFlag": 1
    },
    {
        "row": 245,
        "ucum_code": "kU\/g",
        "description": "kilo enzyme unit per gram",
        "statusFlag": 1
    },
    {
        "row": 246,
        "ucum_code": "kU\/L",
        "description": "kilo enzyme unit per liter",
        "statusFlag": 1
    },
    {
        "row": 247,
        "ucum_code": "kU\/L{class}",
        "description": "kilo enzyme unit per liter class",
        "statusFlag": 1
    },
    {
        "row": 248,
        "ucum_code": "kU\/mL",
        "description": "kilo enzyme unit per milliliter",
        "statusFlag": 1
    },
    {
        "row": 249,
        "ucum_code": "k[IU]\/L",
        "description": "kilo international unit per liter",
        "statusFlag": 1
    },
    {
        "row": 250,
        "ucum_code": "k[IU]\/mL",
        "description": "kilo international unit per milliliter",
        "statusFlag": 1
    },
    {
        "row": 251,
        "ucum_code": "kcal",
        "description": "kilocalorie",
        "statusFlag": 1
    },
    {
        "row": 252,
        "ucum_code": "kcal\/(24.h)",
        "description": "kilocalorie per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 253,
        "ucum_code": "kcal\/d",
        "description": "kilocalorie per day",
        "statusFlag": 1
    },
    {
        "row": 254,
        "ucum_code": "kcal\/h",
        "description": "kilocalorie per hour",
        "statusFlag": 1
    },
    {
        "row": 255,
        "ucum_code": "kcal\/kg\/(24.h)",
        "description": "kilocalorie per kilogram per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 256,
        "ucum_code": "kcal\/[oz_av]",
        "description": "kilocalorie per ounce (US & British)",
        "statusFlag": 1
    },
    {
        "row": 257,
        "ucum_code": "kg",
        "description": "kilogram",
        "statusFlag": 1
    },
    {
        "row": 258,
        "ucum_code": "kg.m\/s",
        "description": "kilogram meter per second",
        "statusFlag": 1
    },
    {
        "row": 259,
        "ucum_code": "kg\/m3",
        "description": "kilogram per cubic meter",
        "statusFlag": 1
    },
    {
        "row": 260,
        "ucum_code": "kg\/h",
        "description": "kilogram per hour",
        "statusFlag": 1
    },
    {
        "row": 261,
        "ucum_code": "kg\/L",
        "description": "kilogram per liter",
        "statusFlag": 1
    },
    {
        "row": 262,
        "ucum_code": "kg\/min",
        "description": "kilogram per minute",
        "statusFlag": 1
    },
    {
        "row": 263,
        "ucum_code": "kg\/mol",
        "description": "kilogram per mole",
        "statusFlag": 1
    },
    {
        "row": 264,
        "ucum_code": "kg\/s",
        "description": "kilogram per second",
        "statusFlag": 1
    },
    {
        "row": 265,
        "ucum_code": "kg\/(s.m2)",
        "description": "kilogram per second per square meter",
        "statusFlag": 1
    },
    {
        "row": 266,
        "ucum_code": "kg\/m2",
        "description": "kilogram per square meter",
        "statusFlag": 1
    },
    {
        "row": 267,
        "ucum_code": "kL",
        "description": "kiloliter",
        "statusFlag": 1
    },
    {
        "row": 268,
        "ucum_code": "km",
        "description": "kilometer",
        "statusFlag": 1
    },
    {
        "row": 269,
        "ucum_code": "kPa",
        "description": "kilopascal",
        "statusFlag": 1
    },
    {
        "row": 270,
        "ucum_code": "ks",
        "description": "kilosecond",
        "statusFlag": 1
    },
    {
        "row": 271,
        "ucum_code": "[ka'U]",
        "description": "King Armstrong unit",
        "statusFlag": 1
    },
    {
        "row": 272,
        "ucum_code": "{KRONU'U}\/mL",
        "description": "Kronus unit per milliliter",
        "statusFlag": 1
    },
    {
        "row": 273,
        "ucum_code": "[knk'U]",
        "description": "Kunkel unit",
        "statusFlag": 1
    },
    {
        "row": 274,
        "ucum_code": "L",
        "description": "liter",
        "statusFlag": 1
    },
    {
        "row": 275,
        "ucum_code": "L\/(24.h)",
        "description": "liter per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 276,
        "ucum_code": "L\/(8.h)",
        "description": "liter per 8 hour",
        "statusFlag": 1
    },
    {
        "row": 277,
        "ucum_code": "L\/d",
        "description": "liter per day",
        "statusFlag": 1
    },
    {
        "row": 278,
        "ucum_code": "L\/h",
        "description": "liter per hour",
        "statusFlag": 1
    },
    {
        "row": 279,
        "ucum_code": "L\/kg",
        "description": "liter per kilogram",
        "statusFlag": 1
    },
    {
        "row": 280,
        "ucum_code": "L\/L",
        "description": "liter per liter",
        "statusFlag": 1
    },
    {
        "row": 281,
        "ucum_code": "L\/min",
        "description": "liter per minute",
        "statusFlag": 1
    },
    {
        "row": 282,
        "ucum_code": "L\/min\/m2",
        "description": "liter per minute per sqaure meter",
        "statusFlag": 1
    },
    {
        "row": 283,
        "ucum_code": "L\/(min.m2)",
        "description": "liter per minute per square meter",
        "statusFlag": 1
    },
    {
        "row": 284,
        "ucum_code": "L\/s",
        "description": "liter per second",
        "statusFlag": 1
    },
    {
        "row": 285,
        "ucum_code": "L\/s\/s2",
        "description": "liter per second per square second",
        "statusFlag": 1
    },
    {
        "row": 286,
        "ucum_code": "{Log_copies}\/mL",
        "description": "log (base 10) copies per milliliter",
        "statusFlag": 1
    },
    {
        "row": 287,
        "ucum_code": "{Log_IU}",
        "description": "log (base 10) international unit",
        "statusFlag": 1
    },
    {
        "row": 288,
        "ucum_code": "{Log_IU}\/mL",
        "description": "log (base 10) international unit per milliliter",
        "statusFlag": 1
    },
    {
        "row": 289,
        "ucum_code": "{Log}",
        "description": "log base 10",
        "statusFlag": 1
    },
    {
        "row": 290,
        "ucum_code": "[LPF]",
        "description": "low power field",
        "statusFlag": 1
    },
    {
        "row": 291,
        "ucum_code": "lm",
        "description": "lumen",
        "statusFlag": 1
    },
    {
        "row": 292,
        "ucum_code": "lm.m2",
        "description": "lumen square meter",
        "statusFlag": 1
    },
    {
        "row": 293,
        "ucum_code": "{Lyme_index_value}",
        "description": "Lyme index value",
        "statusFlag": 1
    },
    {
        "row": 294,
        "ucum_code": "[mclg'U]",
        "description": "Maclagan unit",
        "statusFlag": 1
    },
    {
        "row": 295,
        "ucum_code": "Ms",
        "description": "megasecond",
        "statusFlag": 1
    },
    {
        "row": 296,
        "ucum_code": "[MET].min\/wk",
        "description": "metabolic equivalent minute per week",
        "statusFlag": 1
    },
    {
        "row": 297,
        "ucum_code": "m",
        "description": "meter",
        "statusFlag": 1
    },
    {
        "row": 298,
        "ucum_code": "m\/s",
        "description": "meter per second",
        "statusFlag": 1
    },
    {
        "row": 299,
        "ucum_code": "m\/s2",
        "description": "meter per square second",
        "statusFlag": 1
    },
    {
        "row": 300,
        "ucum_code": "t",
        "description": "metric ton",
        "statusFlag": 1
    },
    {
        "row": 301,
        "ucum_code": "uU\/g",
        "description": "micro enzyme unit per gram",
        "statusFlag": 1
    },
    {
        "row": 302,
        "ucum_code": "uU\/L",
        "description": "micro enzyme unit per liter",
        "statusFlag": 1
    },
    {
        "row": 303,
        "ucum_code": "uU\/mL",
        "description": "micro enzyme unit per milliliter",
        "statusFlag": 1
    },
    {
        "row": 304,
        "ucum_code": "u[IU]",
        "description": "micro international unit",
        "statusFlag": 1
    },
    {
        "row": 305,
        "ucum_code": "u[IU]\/mL",
        "description": "micro international unit per milliliter",
        "statusFlag": 1
    },
    {
        "row": 306,
        "ucum_code": "ueq",
        "description": "microequivalent",
        "statusFlag": 1
    },
    {
        "row": 307,
        "ucum_code": "ueq\/L",
        "description": "microequivalent per liter",
        "statusFlag": 1
    },
    {
        "row": 308,
        "ucum_code": "ueq\/mL",
        "description": "microequivalent per milliliter",
        "statusFlag": 1
    },
    {
        "row": 309,
        "ucum_code": "ug",
        "description": "microgram",
        "statusFlag": 1
    },
    {
        "row": 310,
        "ucum_code": "ug\/g{feces}",
        "description": "microgram  per gram of feces",
        "statusFlag": 1
    },
    {
        "row": 311,
        "ucum_code": "ug{FEU}\/mL",
        "description": "microgram fibrinogen equivalent unit per milliliter",
        "statusFlag": 1
    },
    {
        "row": 312,
        "ucum_code": "ug\/(100.g)",
        "description": "microgram per 100 gram",
        "statusFlag": 1
    },
    {
        "row": 313,
        "ucum_code": "ug\/(24.h)",
        "description": "microgram per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 314,
        "ucum_code": "ug\/(8.h)",
        "description": "microgram per 8 hour",
        "statusFlag": 1
    },
    {
        "row": 315,
        "ucum_code": "ug\/m3",
        "description": "microgram per cubic meter",
        "statusFlag": 1
    },
    {
        "row": 316,
        "ucum_code": "ug\/d",
        "description": "microgram per day",
        "statusFlag": 1
    },
    {
        "row": 317,
        "ucum_code": "ug\/dL",
        "description": "microgram per deciliter",
        "statusFlag": 1
    },
    {
        "row": 318,
        "ucum_code": "ug\/dL{RBCs}",
        "description": "microgram per deciliter of red blood cells",
        "statusFlag": 1
    },
    {
        "row": 319,
        "ucum_code": "ug\/g",
        "description": "microgram per gram",
        "statusFlag": 1
    },
    {
        "row": 320,
        "ucum_code": "ug\/g{creat}",
        "description": "microgram per gram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 321,
        "ucum_code": "ug\/g{dry_tissue}",
        "description": "microgram per gram of dry tissue",
        "statusFlag": 1
    },
    {
        "row": 322,
        "ucum_code": "ug\/g{dry_wt}",
        "description": "microgram per gram of dry weight",
        "statusFlag": 1
    },
    {
        "row": 323,
        "ucum_code": "ug\/g{hair}",
        "description": "microgram per gram of hair",
        "statusFlag": 1
    },
    {
        "row": 324,
        "ucum_code": "ug\/g{Hb}",
        "description": "microgram per gram of hemoglobin",
        "statusFlag": 1
    },
    {
        "row": 325,
        "ucum_code": "ug\/g{tissue}",
        "description": "microgram per gram of tissue",
        "statusFlag": 1
    },
    {
        "row": 326,
        "ucum_code": "ug\/h",
        "description": "microgram per hour",
        "statusFlag": 1
    },
    {
        "row": 327,
        "ucum_code": "ug\/kg",
        "description": "microgram per kilogram",
        "statusFlag": 1
    },
    {
        "row": 328,
        "ucum_code": "ug\/kg\/(8.h)",
        "description": "microgram per kilogram per 8 hour",
        "statusFlag": 1
    },
    {
        "row": 329,
        "ucum_code": "ug\/kg\/d",
        "description": "microgram per kilogram per day",
        "statusFlag": 1
    },
    {
        "row": 330,
        "ucum_code": "ug\/kg\/h",
        "description": "microgram per kilogram per hour",
        "statusFlag": 1
    },
    {
        "row": 331,
        "ucum_code": "ug\/kg\/min",
        "description": "microgram per kilogram per minute",
        "statusFlag": 1
    },
    {
        "row": 332,
        "ucum_code": "ug\/L",
        "description": "microgram per liter",
        "statusFlag": 1
    },
    {
        "row": 333,
        "ucum_code": "ug\/L{RBCs}",
        "description": "microgram per liter of red blood cells",
        "statusFlag": 1
    },
    {
        "row": 334,
        "ucum_code": "ug\/L\/(24.h)",
        "description": "microgram per liter per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 335,
        "ucum_code": "ug\/mg",
        "description": "microgram per milligram",
        "statusFlag": 1
    },
    {
        "row": 336,
        "ucum_code": "ug\/mg{creat}",
        "description": "microgram per milligram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 337,
        "ucum_code": "ug\/mL",
        "description": "microgram per milliliter",
        "statusFlag": 1
    },
    {
        "row": 338,
        "ucum_code": "ug\/mL{class}",
        "description": "microgram per milliliter class",
        "statusFlag": 1
    },
    {
        "row": 339,
        "ucum_code": "ug\/mL{eqv}",
        "description": "microgram per milliliter equivalent",
        "statusFlag": 1
    },
    {
        "row": 340,
        "ucum_code": "ug\/mmol",
        "description": "microgram per millimole",
        "statusFlag": 1
    },
    {
        "row": 341,
        "ucum_code": "ug\/mmol{creat}",
        "description": "microgram per millimole of creatinine",
        "statusFlag": 1
    },
    {
        "row": 342,
        "ucum_code": "ug\/min",
        "description": "microgram per minute",
        "statusFlag": 1
    },
    {
        "row": 343,
        "ucum_code": "ug\/ng",
        "description": "microgram per nanogram",
        "statusFlag": 1
    },
    {
        "row": 344,
        "ucum_code": "ug\/{specimen}",
        "description": "microgram per specimen",
        "statusFlag": 1
    },
    {
        "row": 345,
        "ucum_code": "ug\/[sft_i]",
        "description": "microgram per square foot (international)",
        "statusFlag": 1
    },
    {
        "row": 346,
        "ucum_code": "ug\/m2",
        "description": "microgram per square meter",
        "statusFlag": 1
    },
    {
        "row": 347,
        "ucum_code": "u[IU]\/L",
        "description": "microinternational unit per liter",
        "statusFlag": 1
    },
    {
        "row": 348,
        "ucum_code": "ukat",
        "description": "microkatal",
        "statusFlag": 1
    },
    {
        "row": 349,
        "ucum_code": "uL",
        "description": "microliter",
        "statusFlag": 1
    },
    {
        "row": 350,
        "ucum_code": "uL\/(2.h)",
        "description": "microliter per 2 hour",
        "statusFlag": 1
    },
    {
        "row": 351,
        "ucum_code": "uL\/h",
        "description": "microliter per hour",
        "statusFlag": 1
    },
    {
        "row": 352,
        "ucum_code": "um",
        "description": "micrometer",
        "statusFlag": 1
    },
    {
        "row": 353,
        "ucum_code": "umol",
        "description": "micromole",
        "statusFlag": 1
    },
    {
        "row": 354,
        "ucum_code": "umol{BCE}\/mol",
        "description": "micromole bone collagen equivalent per mole",
        "statusFlag": 1
    },
    {
        "row": 355,
        "ucum_code": "umol\/(2.h)",
        "description": "micromole per 2 hour",
        "statusFlag": 1
    },
    {
        "row": 356,
        "ucum_code": "umol\/(24.h)",
        "description": "micromole per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 357,
        "ucum_code": "umol\/(8.h)",
        "description": "micromole per 8 hour",
        "statusFlag": 1
    },
    {
        "row": 358,
        "ucum_code": "umol\/d",
        "description": "micromole per day",
        "statusFlag": 1
    },
    {
        "row": 359,
        "ucum_code": "umol\/dL",
        "description": "micromole per deciliter",
        "statusFlag": 1
    },
    {
        "row": 360,
        "ucum_code": "umol\/dL{GF}",
        "description": "micromole per deciliter of glomerular filtrate",
        "statusFlag": 1
    },
    {
        "row": 361,
        "ucum_code": "umol\/g",
        "description": "micromole per gram",
        "statusFlag": 1
    },
    {
        "row": 362,
        "ucum_code": "umol\/g{creat}",
        "description": "micromole per gram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 363,
        "ucum_code": "umol\/g{Hb}",
        "description": "micromole per gram of hemoglobin",
        "statusFlag": 1
    },
    {
        "row": 364,
        "ucum_code": "umol\/h",
        "description": "micromole per hour",
        "statusFlag": 1
    },
    {
        "row": 365,
        "ucum_code": "umol\/kg",
        "description": "micromole per kilogram",
        "statusFlag": 1
    },
    {
        "row": 366,
        "ucum_code": "umol\/kg{feces}",
        "description": "micromole per kilogram of feces",
        "statusFlag": 1
    },
    {
        "row": 367,
        "ucum_code": "umol\/L",
        "description": "micromole per liter",
        "statusFlag": 1
    },
    {
        "row": 368,
        "ucum_code": "umol\/L{RBCs}",
        "description": "micromole per liter of red blood cells",
        "statusFlag": 1
    },
    {
        "row": 369,
        "ucum_code": "umol\/L\/h",
        "description": "micromole per liter per hour",
        "statusFlag": 1
    },
    {
        "row": 370,
        "ucum_code": "umol\/umol",
        "description": "micromole per micromole",
        "statusFlag": 1
    },
    {
        "row": 371,
        "ucum_code": "umol\/umol{creat}",
        "description": "micromole per micromole of creatinine",
        "statusFlag": 1
    },
    {
        "row": 372,
        "ucum_code": "umol\/mg",
        "description": "micromole per milligram",
        "statusFlag": 1
    },
    {
        "row": 373,
        "ucum_code": "umol\/mg{creat}",
        "description": "micromole per milligram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 374,
        "ucum_code": "umol\/mL",
        "description": "micromole per milliliter",
        "statusFlag": 1
    },
    {
        "row": 375,
        "ucum_code": "umol\/mL\/min",
        "description": "micromole per milliliter per minute",
        "statusFlag": 1
    },
    {
        "row": 376,
        "ucum_code": "umol\/mmol",
        "description": "micromole per millimole",
        "statusFlag": 1
    },
    {
        "row": 377,
        "ucum_code": "umol\/mmol{creat}",
        "description": "micromole per millimole of creatinine",
        "statusFlag": 1
    },
    {
        "row": 378,
        "ucum_code": "umol\/10*6{RBC}",
        "description": "micromole per million red blood cell",
        "statusFlag": 1
    },
    {
        "row": 379,
        "ucum_code": "umol\/min",
        "description": "micromole per minute",
        "statusFlag": 1
    },
    {
        "row": 380,
        "ucum_code": "umol\/min\/g",
        "description": "micromole per minute per gram",
        "statusFlag": 1
    },
    {
        "row": 381,
        "ucum_code": "umol\/min\/g{mucosa}",
        "description": "micromole per minute per gram of mucosa",
        "statusFlag": 1
    },
    {
        "row": 382,
        "ucum_code": "umol\/min\/g{prot}",
        "description": "micromole per minute per gram of protein",
        "statusFlag": 1
    },
    {
        "row": 383,
        "ucum_code": "umol\/min\/L",
        "description": "micromole per minute per liter",
        "statusFlag": 1
    },
    {
        "row": 384,
        "ucum_code": "umol\/mol",
        "description": "micromole per mole",
        "statusFlag": 1
    },
    {
        "row": 385,
        "ucum_code": "umol\/mol{creat}",
        "description": "micromole per mole of creatinine",
        "statusFlag": 1
    },
    {
        "row": 386,
        "ucum_code": "umol\/mol{Hb}",
        "description": "micromole per mole of hemoglobin",
        "statusFlag": 1
    },
    {
        "row": 387,
        "ucum_code": "um\/s",
        "description": "microns per second",
        "statusFlag": 1
    },
    {
        "row": 388,
        "ucum_code": "uOhm",
        "description": "microOhm",
        "statusFlag": 1
    },
    {
        "row": 389,
        "ucum_code": "us",
        "description": "microsecond",
        "statusFlag": 1
    },
    {
        "row": 390,
        "ucum_code": "uV",
        "description": "microvolt",
        "statusFlag": 1
    },
    {
        "row": 391,
        "ucum_code": "[mi_i]",
        "description": "mile (international)",
        "statusFlag": 1
    },
    {
        "row": 392,
        "ucum_code": "mU\/g",
        "description": "milli  enzyme unit per gram",
        "statusFlag": 1
    },
    {
        "row": 393,
        "ucum_code": "mU\/mL",
        "description": "milli  enzyme unit per milliliter",
        "statusFlag": 1
    },
    {
        "row": 394,
        "ucum_code": "mU\/mL\/min",
        "description": "milli  enzyme unit per milliliter per minute",
        "statusFlag": 1
    },
    {
        "row": 395,
        "ucum_code": "mU\/mmol{creat}",
        "description": "milli  enzyme unit per millimole of creatinine",
        "statusFlag": 1
    },
    {
        "row": 396,
        "ucum_code": "mU\/mmol{RBCs}",
        "description": "milli  enzyme unit per millimole of red blood cells",
        "statusFlag": 1
    },
    {
        "row": 397,
        "ucum_code": "m[IU]\/mL",
        "description": "milli  international unit per milliliter",
        "statusFlag": 1
    },
    {
        "row": 398,
        "ucum_code": "mU\/g{Hb}",
        "description": "milli enzyme unit per gram of hemoglobin",
        "statusFlag": 1
    },
    {
        "row": 399,
        "ucum_code": "mU\/g{prot}",
        "description": "milli enzyme unit per gram of protein",
        "statusFlag": 1
    },
    {
        "row": 400,
        "ucum_code": "mU\/L",
        "description": "milli enzyme unit per liter",
        "statusFlag": 1
    },
    {
        "row": 401,
        "ucum_code": "mU\/mg",
        "description": "milli enzyme unit per milligram",
        "statusFlag": 1
    },
    {
        "row": 402,
        "ucum_code": "mU\/mg{creat}",
        "description": "milli enzyme unit per milligram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 403,
        "ucum_code": "m[IU]\/L",
        "description": "milli international unit per liter",
        "statusFlag": 1
    },
    {
        "row": 404,
        "ucum_code": "mA",
        "description": "milliampere",
        "statusFlag": 1
    },
    {
        "row": 405,
        "ucum_code": "mbar",
        "description": "millibar",
        "statusFlag": 1
    },
    {
        "row": 406,
        "ucum_code": "mbar\/L\/s",
        "description": "millibar per liter per second",
        "statusFlag": 1
    },
    {
        "row": 407,
        "ucum_code": "mbar.s\/L",
        "description": "millibar second per liter",
        "statusFlag": 1
    },
    {
        "row": 408,
        "ucum_code": "meq",
        "description": "milliequivalent",
        "statusFlag": 1
    },
    {
        "row": 409,
        "ucum_code": "meq\/(2.h)",
        "description": "milliequivalent per 2 hour",
        "statusFlag": 1
    },
    {
        "row": 410,
        "ucum_code": "meq\/(24.h)",
        "description": "milliequivalent per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 411,
        "ucum_code": "meq\/(8.h)",
        "description": "milliequivalent per 8 hour",
        "statusFlag": 1
    },
    {
        "row": 412,
        "ucum_code": "meq\/d",
        "description": "milliequivalent per day",
        "statusFlag": 1
    },
    {
        "row": 413,
        "ucum_code": "meq\/dL",
        "description": "milliequivalent per deciliter",
        "statusFlag": 1
    },
    {
        "row": 414,
        "ucum_code": "meq\/g",
        "description": "milliequivalent per gram",
        "statusFlag": 1
    },
    {
        "row": 415,
        "ucum_code": "meq\/g{creat}",
        "description": "milliequivalent per gram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 416,
        "ucum_code": "meq\/h",
        "description": "milliequivalent per hour",
        "statusFlag": 1
    },
    {
        "row": 417,
        "ucum_code": "meq\/kg",
        "description": "milliequivalent per kilogram",
        "statusFlag": 1
    },
    {
        "row": 418,
        "ucum_code": "meq\/kg\/h",
        "description": "milliequivalent per kilogram per hour",
        "statusFlag": 1
    },
    {
        "row": 419,
        "ucum_code": "meq\/L",
        "description": "milliequivalent per liter",
        "statusFlag": 1
    },
    {
        "row": 420,
        "ucum_code": "meq\/mL",
        "description": "milliequivalent per milliliter",
        "statusFlag": 1
    },
    {
        "row": 421,
        "ucum_code": "meq\/min",
        "description": "milliequivalent per minute",
        "statusFlag": 1
    },
    {
        "row": 422,
        "ucum_code": "meq\/{specimen}",
        "description": "milliequivalent per specimen",
        "statusFlag": 1
    },
    {
        "row": 423,
        "ucum_code": "meq\/m2",
        "description": "milliequivalent per square meter",
        "statusFlag": 1
    },
    {
        "row": 424,
        "ucum_code": "meq\/{total_volume}",
        "description": "milliequivalent per total volume",
        "statusFlag": 1
    },
    {
        "row": 425,
        "ucum_code": "mg",
        "description": "milligram",
        "statusFlag": 1
    },
    {
        "row": 426,
        "ucum_code": "mg{FEU}\/L",
        "description": "milligram fibrinogen equivalent unit per liter",
        "statusFlag": 1
    },
    {
        "row": 427,
        "ucum_code": "mg\/(10.h)",
        "description": "milligram per 10 hour",
        "statusFlag": 1
    },
    {
        "row": 428,
        "ucum_code": "mg\/(12.h)",
        "description": "milligram per 12 hour",
        "statusFlag": 1
    },
    {
        "row": 429,
        "ucum_code": "mg\/(2.h)",
        "description": "milligram per 2 hour",
        "statusFlag": 1
    },
    {
        "row": 430,
        "ucum_code": "mg\/(24.h)",
        "description": "milligram per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 431,
        "ucum_code": "mg\/(6.h)",
        "description": "milligram per 6 hour",
        "statusFlag": 1
    },
    {
        "row": 432,
        "ucum_code": "mg\/(72.h)",
        "description": "milligram per 72 hour",
        "statusFlag": 1
    },
    {
        "row": 433,
        "ucum_code": "mg\/(8.h)",
        "description": "milligram per 8 hour",
        "statusFlag": 1
    },
    {
        "row": 434,
        "ucum_code": "mg\/{collection}",
        "description": "milligram per collection",
        "statusFlag": 1
    },
    {
        "row": 435,
        "ucum_code": "mg\/m3",
        "description": "milligram per cubic meter",
        "statusFlag": 1
    },
    {
        "row": 436,
        "ucum_code": "mg\/d",
        "description": "milligram per day",
        "statusFlag": 1
    },
    {
        "row": 437,
        "ucum_code": "mg\/d\/{1.73_m2}",
        "description": "milligram per day per 1.73 square meter",
        "statusFlag": 1
    },
    {
        "row": 438,
        "ucum_code": "mg\/dL",
        "description": "milligram per deciliter",
        "statusFlag": 1
    },
    {
        "row": 439,
        "ucum_code": "mg\/dL{RBCs}",
        "description": "milligram per deciliter of red blood cells",
        "statusFlag": 1
    },
    {
        "row": 440,
        "ucum_code": "mg\/g",
        "description": "milligram per gram",
        "statusFlag": 1
    },
    {
        "row": 441,
        "ucum_code": "mg\/g{creat}",
        "description": "milligram per gram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 442,
        "ucum_code": "mg\/g{dry_tissue}",
        "description": "milligram per gram of dry tissue",
        "statusFlag": 1
    },
    {
        "row": 443,
        "ucum_code": "mg\/g{feces}",
        "description": "milligram per gram of feces",
        "statusFlag": 1
    },
    {
        "row": 444,
        "ucum_code": "mg\/g{tissue}",
        "description": "milligram per gram of tissue",
        "statusFlag": 1
    },
    {
        "row": 445,
        "ucum_code": "mg\/g{wet_tissue}",
        "description": "milligram per gram of wet tissue",
        "statusFlag": 1
    },
    {
        "row": 446,
        "ucum_code": "mg\/h",
        "description": "milligram per hour",
        "statusFlag": 1
    },
    {
        "row": 447,
        "ucum_code": "mg\/kg",
        "description": "milligram per kilogram",
        "statusFlag": 1
    },
    {
        "row": 448,
        "ucum_code": "mg\/kg\/(8.h)",
        "description": "milligram per kilogram per 8 hour",
        "statusFlag": 1
    },
    {
        "row": 449,
        "ucum_code": "mg\/kg\/d",
        "description": "milligram per kilogram per day",
        "statusFlag": 1
    },
    {
        "row": 450,
        "ucum_code": "mg\/kg\/h",
        "description": "milligram per kilogram per hour",
        "statusFlag": 1
    },
    {
        "row": 451,
        "ucum_code": "mg\/kg\/min",
        "description": "milligram per kilogram per minute",
        "statusFlag": 1
    },
    {
        "row": 452,
        "ucum_code": "mg\/L",
        "description": "milligram per liter",
        "statusFlag": 1
    },
    {
        "row": 453,
        "ucum_code": "mg\/L{RBCs}",
        "description": "milligram per liter of red blood cells",
        "statusFlag": 1
    },
    {
        "row": 454,
        "ucum_code": "mg\/mg",
        "description": "milligram per milligram",
        "statusFlag": 1
    },
    {
        "row": 455,
        "ucum_code": "mg\/mg{creat}",
        "description": "milligram per milligram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 456,
        "ucum_code": "mg\/mL",
        "description": "milligram per milliliter",
        "statusFlag": 1
    },
    {
        "row": 457,
        "ucum_code": "mg\/mmol",
        "description": "milligram per millimole",
        "statusFlag": 1
    },
    {
        "row": 458,
        "ucum_code": "mg\/mmol{creat}",
        "description": "milligram per millimole of creatinine",
        "statusFlag": 1
    },
    {
        "row": 459,
        "ucum_code": "mg\/min",
        "description": "milligram per minute",
        "statusFlag": 1
    },
    {
        "row": 460,
        "ucum_code": "mg\/{specimen}",
        "description": "milligram per specimen",
        "statusFlag": 1
    },
    {
        "row": 461,
        "ucum_code": "mg\/m2",
        "description": "milligram per square meter",
        "statusFlag": 1
    },
    {
        "row": 462,
        "ucum_code": "mg\/{total_output}",
        "description": "milligram per total output",
        "statusFlag": 1
    },
    {
        "row": 463,
        "ucum_code": "mg\/{total_volume}",
        "description": "milligram per total volume",
        "statusFlag": 1
    },
    {
        "row": 464,
        "ucum_code": "mg\/wk",
        "description": "milligram per week",
        "statusFlag": 1
    },
    {
        "row": 465,
        "ucum_code": "mL",
        "description": "milliliter",
        "statusFlag": 1
    },
    {
        "row": 466,
        "ucum_code": "mL{fetal_RBCs}",
        "description": "milliliter of fetal red blood cells",
        "statusFlag": 1
    },
    {
        "row": 467,
        "ucum_code": "mL\/(10.h)",
        "description": "milliliter per 10 hour",
        "statusFlag": 1
    },
    {
        "row": 468,
        "ucum_code": "mL\/(12.h)",
        "description": "milliliter per 12 hour",
        "statusFlag": 1
    },
    {
        "row": 469,
        "ucum_code": "mL\/(2.h)",
        "description": "milliliter per 2 hour",
        "statusFlag": 1
    },
    {
        "row": 470,
        "ucum_code": "mL\/(24.h)",
        "description": "milliliter per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 471,
        "ucum_code": "mL\/(4.h)",
        "description": "milliliter per 4 hour",
        "statusFlag": 1
    },
    {
        "row": 472,
        "ucum_code": "mL\/(5.h)",
        "description": "milliliter per 5 hour",
        "statusFlag": 1
    },
    {
        "row": 473,
        "ucum_code": "mL\/(6.h)",
        "description": "milliliter per 6 hour",
        "statusFlag": 1
    },
    {
        "row": 474,
        "ucum_code": "mL\/(72.h)",
        "description": "milliliter per 72 hour",
        "statusFlag": 1
    },
    {
        "row": 475,
        "ucum_code": "mL\/(8.h)",
        "description": "milliliter per 8 hour",
        "statusFlag": 1
    },
    {
        "row": 476,
        "ucum_code": "mL\/(8.h)\/kg",
        "description": "milliliter per 8 hour per kilogram",
        "statusFlag": 1
    },
    {
        "row": 477,
        "ucum_code": "mL\/cm[H2O]",
        "description": "milliliter per centimeter of water",
        "statusFlag": 1
    },
    {
        "row": 478,
        "ucum_code": "mL\/d",
        "description": "milliliter per day",
        "statusFlag": 1
    },
    {
        "row": 479,
        "ucum_code": "mL\/dL",
        "description": "milliliter per deciliter",
        "statusFlag": 1
    },
    {
        "row": 480,
        "ucum_code": "mL\/{beat}",
        "description": "milliliter per heart beat",
        "statusFlag": 1
    },
    {
        "row": 481,
        "ucum_code": "mL\/{beat}\/m2",
        "description": "milliliter per heart beat per  square meter",
        "statusFlag": 1
    },
    {
        "row": 482,
        "ucum_code": "mL\/h",
        "description": "milliliter per hour",
        "statusFlag": 1
    },
    {
        "row": 483,
        "ucum_code": "mL\/kg",
        "description": "milliliter per kilogram",
        "statusFlag": 1
    },
    {
        "row": 484,
        "ucum_code": "mL\/kg\/(8.h)",
        "description": "milliliter per kilogram per 8 hour",
        "statusFlag": 1
    },
    {
        "row": 485,
        "ucum_code": "mL\/kg\/d",
        "description": "milliliter per kilogram per day",
        "statusFlag": 1
    },
    {
        "row": 486,
        "ucum_code": "mL\/kg\/h",
        "description": "milliliter per kilogram per hour",
        "statusFlag": 1
    },
    {
        "row": 487,
        "ucum_code": "mL\/kg\/min",
        "description": "milliliter per kilogram per minute",
        "statusFlag": 1
    },
    {
        "row": 488,
        "ucum_code": "mL\/mbar",
        "description": "milliliter per millibar",
        "statusFlag": 1
    },
    {
        "row": 489,
        "ucum_code": "mL\/mm",
        "description": "milliliter per millimeter",
        "statusFlag": 1
    },
    {
        "row": 490,
        "ucum_code": "mL\/min",
        "description": "milliliter per minute",
        "statusFlag": 1
    },
    {
        "row": 491,
        "ucum_code": "mL\/min\/{1.73_m2}",
        "description": "milliliter per minute per 1.73 square meter",
        "statusFlag": 1
    },
    {
        "row": 492,
        "ucum_code": "mL\/min\/m2",
        "description": "milliliter per minute per square meter",
        "statusFlag": 1
    },
    {
        "row": 493,
        "ucum_code": "mL\/s",
        "description": "milliliter per second",
        "statusFlag": 1
    },
    {
        "row": 494,
        "ucum_code": "mL\/[sin_i]",
        "description": "milliliter per square inch (international)",
        "statusFlag": 1
    },
    {
        "row": 495,
        "ucum_code": "mL\/m2",
        "description": "milliliter per square meter",
        "statusFlag": 1
    },
    {
        "row": 496,
        "ucum_code": "mm",
        "description": "millimeter",
        "statusFlag": 1
    },
    {
        "row": 497,
        "ucum_code": "mm[Hg]",
        "description": "millimeter of mercury",
        "statusFlag": 1
    },
    {
        "row": 498,
        "ucum_code": "mm[H2O]",
        "description": "millimeter of water",
        "statusFlag": 1
    },
    {
        "row": 499,
        "ucum_code": "mm\/h",
        "description": "millimeter per hour",
        "statusFlag": 1
    },
    {
        "row": 500,
        "ucum_code": "mm\/min",
        "description": "millimeter per minute",
        "statusFlag": 1
    },
    {
        "row": 501,
        "ucum_code": "mmol",
        "description": "millimole",
        "statusFlag": 1
    },
    {
        "row": 502,
        "ucum_code": "mmol\/(12.h)",
        "description": "millimole per 12 hour",
        "statusFlag": 1
    },
    {
        "row": 503,
        "ucum_code": "mmol\/(2.h)",
        "description": "millimole per 2 hour",
        "statusFlag": 1
    },
    {
        "row": 504,
        "ucum_code": "mmol\/(24.h)",
        "description": "millimole per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 505,
        "ucum_code": "mmol\/(5.h)",
        "description": "millimole per 5 hour",
        "statusFlag": 1
    },
    {
        "row": 506,
        "ucum_code": "mmol\/(6.h)",
        "description": "millimole per 6 hour",
        "statusFlag": 1
    },
    {
        "row": 507,
        "ucum_code": "mmol\/(8.h)",
        "description": "millimole per 8 hour",
        "statusFlag": 1
    },
    {
        "row": 508,
        "ucum_code": "mmol\/d",
        "description": "millimole per day",
        "statusFlag": 1
    },
    {
        "row": 509,
        "ucum_code": "mmol\/dL",
        "description": "millimole per deciliter",
        "statusFlag": 1
    },
    {
        "row": 510,
        "ucum_code": "mmol\/{ejaculate}",
        "description": "millimole per ejaculate",
        "statusFlag": 1
    },
    {
        "row": 511,
        "ucum_code": "mmol\/g",
        "description": "millimole per gram",
        "statusFlag": 1
    },
    {
        "row": 512,
        "ucum_code": "mmol\/g{creat}",
        "description": "millimole per gram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 513,
        "ucum_code": "mmol\/h",
        "description": "millimole per hour",
        "statusFlag": 1
    },
    {
        "row": 514,
        "ucum_code": "mmol\/h\/mg{Hb}",
        "description": "millimole per hour per milligram of hemoglobin",
        "statusFlag": 1
    },
    {
        "row": 515,
        "ucum_code": "mmol\/h\/mg{prot}",
        "description": "millimole per hour per milligram of protein",
        "statusFlag": 1
    },
    {
        "row": 516,
        "ucum_code": "mmol\/kg",
        "description": "millimole per kilogram",
        "statusFlag": 1
    },
    {
        "row": 517,
        "ucum_code": "mmol\/kg\/(8.h)",
        "description": "millimole per kilogram per 8 hour",
        "statusFlag": 1
    },
    {
        "row": 518,
        "ucum_code": "mmol\/kg\/d",
        "description": "millimole per kilogram per day",
        "statusFlag": 1
    },
    {
        "row": 519,
        "ucum_code": "mmol\/kg\/h",
        "description": "millimole per kilogram per hour",
        "statusFlag": 1
    },
    {
        "row": 520,
        "ucum_code": "mmol\/kg\/min",
        "description": "millimole per kilogram per minute",
        "statusFlag": 1
    },
    {
        "row": 521,
        "ucum_code": "mmol\/L",
        "description": "millimole per liter",
        "statusFlag": 1
    },
    {
        "row": 522,
        "ucum_code": "mmol\/L{RBCs}",
        "description": "millimole per liter of red blood cells",
        "statusFlag": 1
    },
    {
        "row": 523,
        "ucum_code": "mmol\/mmol",
        "description": "millimole per millimole",
        "statusFlag": 1
    },
    {
        "row": 524,
        "ucum_code": "mmol\/mmol{urea}",
        "description": "millimole per millimole of urea",
        "statusFlag": 1
    },
    {
        "row": 525,
        "ucum_code": "mmol\/mmol{creat}",
        "description": "millimole per millmole of creatinine",
        "statusFlag": 1
    },
    {
        "row": 526,
        "ucum_code": "mmol\/min",
        "description": "millimole per minute",
        "statusFlag": 1
    },
    {
        "row": 527,
        "ucum_code": "mmol\/mol",
        "description": "millimole per mole",
        "statusFlag": 1
    },
    {
        "row": 528,
        "ucum_code": "mmol\/mol{creat}",
        "description": "millimole per mole of creatinine",
        "statusFlag": 1
    },
    {
        "row": 529,
        "ucum_code": "mmol\/s\/L",
        "description": "millimole per second per liter",
        "statusFlag": 1
    },
    {
        "row": 530,
        "ucum_code": "mmol\/{specimen}",
        "description": "millimole per specimen",
        "statusFlag": 1
    },
    {
        "row": 531,
        "ucum_code": "mmol\/m2",
        "description": "millimole per square meter",
        "statusFlag": 1
    },
    {
        "row": 532,
        "ucum_code": "mmol\/{total_vol}",
        "description": "millimole per total volume",
        "statusFlag": 1
    },
    {
        "row": 533,
        "ucum_code": "10*6",
        "description": "million",
        "statusFlag": 1
    },
    {
        "row": 534,
        "ucum_code": "10*6.[CFU]\/L",
        "description": "million colony forming unit per liter",
        "statusFlag": 1
    },
    {
        "row": 535,
        "ucum_code": "10*6.[IU]",
        "description": "million international unit",
        "statusFlag": 1
    },
    {
        "row": 536,
        "ucum_code": "10*6\/(24.h)",
        "description": "million per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 537,
        "ucum_code": "10*6\/kg",
        "description": "million per kilogram",
        "statusFlag": 1
    },
    {
        "row": 538,
        "ucum_code": "10*6\/L",
        "description": "million per liter",
        "statusFlag": 1
    },
    {
        "row": 539,
        "ucum_code": "10*6\/uL",
        "description": "million per microliter",
        "statusFlag": 1
    },
    {
        "row": 540,
        "ucum_code": "10*6\/mL",
        "description": "million per milliliter",
        "statusFlag": 1
    },
    {
        "row": 541,
        "ucum_code": "mosm",
        "description": "milliosmole",
        "statusFlag": 1
    },
    {
        "row": 542,
        "ucum_code": "mosm\/kg",
        "description": "milliosmole per kilogram",
        "statusFlag": 1
    },
    {
        "row": 543,
        "ucum_code": "mosm\/L",
        "description": "milliosmole per liter",
        "statusFlag": 1
    },
    {
        "row": 544,
        "ucum_code": "mPa",
        "description": "millipascal",
        "statusFlag": 1
    },
    {
        "row": 545,
        "ucum_code": "mPa.s",
        "description": "millipascal second",
        "statusFlag": 1
    },
    {
        "row": 546,
        "ucum_code": "ms",
        "description": "millisecond",
        "statusFlag": 1
    },
    {
        "row": 547,
        "ucum_code": "mV",
        "description": "millivolt",
        "statusFlag": 1
    },
    {
        "row": 548,
        "ucum_code": "mV\/s",
        "description": "millivolt per second",
        "statusFlag": 1
    },
    {
        "row": 549,
        "ucum_code": "{minidrop}\/min",
        "description": "minidrop per minute",
        "statusFlag": 1
    },
    {
        "row": 550,
        "ucum_code": "{minidrop}\/s",
        "description": "minidrop per second",
        "statusFlag": 1
    },
    {
        "row": 551,
        "ucum_code": "min",
        "description": "minute",
        "statusFlag": 1
    },
    {
        "row": 552,
        "ucum_code": "min\/d",
        "description": "minute per day",
        "statusFlag": 1
    },
    {
        "row": 553,
        "ucum_code": "min\/wk",
        "description": "minute per week",
        "statusFlag": 1
    },
    {
        "row": 554,
        "ucum_code": "mol",
        "description": "mole",
        "statusFlag": 1
    },
    {
        "row": 555,
        "ucum_code": "mol\/m3",
        "description": "mole per cubic meter",
        "statusFlag": 1
    },
    {
        "row": 556,
        "ucum_code": "mol\/kg",
        "description": "mole per kilogram",
        "statusFlag": 1
    },
    {
        "row": 557,
        "ucum_code": "mol\/kg\/s",
        "description": "mole per kilogram per second",
        "statusFlag": 1
    },
    {
        "row": 558,
        "ucum_code": "mol\/L",
        "description": "mole per liter",
        "statusFlag": 1
    },
    {
        "row": 559,
        "ucum_code": "mol\/mL",
        "description": "mole per milliliter",
        "statusFlag": 1
    },
    {
        "row": 560,
        "ucum_code": "mol\/mol",
        "description": "mole per mole",
        "statusFlag": 1
    },
    {
        "row": 561,
        "ucum_code": "mol\/s",
        "description": "mole per second",
        "statusFlag": 1
    },
    {
        "row": 562,
        "ucum_code": "{#}\/{platelet}",
        "description": "molecule per platelet",
        "statusFlag": 1
    },
    {
        "row": 563,
        "ucum_code": "mo",
        "description": "month",
        "statusFlag": 1
    },
    {
        "row": 564,
        "ucum_code": "{mm\/dd\/yyyy}",
        "description": "month-day-year",
        "statusFlag": 1
    },
    {
        "row": 565,
        "ucum_code": "{M.o.M}",
        "description": "multiple of the median",
        "statusFlag": 1
    },
    {
        "row": 566,
        "ucum_code": "{mutation}",
        "description": "mutation",
        "statusFlag": 1
    },
    {
        "row": 567,
        "ucum_code": "nU\/mL",
        "description": "nanoenzyme unit per milliliter",
        "statusFlag": 1
    },
    {
        "row": 568,
        "ucum_code": "nU\/{RBC}",
        "description": "nanoenzyme unit per red blood cell",
        "statusFlag": 1
    },
    {
        "row": 569,
        "ucum_code": "ng",
        "description": "nanogram",
        "statusFlag": 1
    },
    {
        "row": 570,
        "ucum_code": "ng{FEU}\/mL",
        "description": "nanogram fibrinogen equivalent unit per milliliter ",
        "statusFlag": 1
    },
    {
        "row": 571,
        "ucum_code": "ng\/(24.h)",
        "description": "nanogram per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 572,
        "ucum_code": "ng\/(8.h)",
        "description": "nanogram per 8 hour",
        "statusFlag": 1
    },
    {
        "row": 573,
        "ucum_code": "ng\/d",
        "description": "nanogram per day",
        "statusFlag": 1
    },
    {
        "row": 574,
        "ucum_code": "ng\/dL",
        "description": "nanogram per deciliter",
        "statusFlag": 1
    },
    {
        "row": 575,
        "ucum_code": "ng\/U",
        "description": "nanogram per enzyme unit",
        "statusFlag": 1
    },
    {
        "row": 576,
        "ucum_code": "ng\/g",
        "description": "nanogram per gram",
        "statusFlag": 1
    },
    {
        "row": 577,
        "ucum_code": "ng\/g{creat}",
        "description": "nanogram per gram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 578,
        "ucum_code": "ng\/h",
        "description": "nanogram per hour",
        "statusFlag": 1
    },
    {
        "row": 579,
        "ucum_code": "ng\/kg",
        "description": "nanogram per kilogram",
        "statusFlag": 1
    },
    {
        "row": 580,
        "ucum_code": "ng\/kg\/(8.h)",
        "description": "nanogram per kilogram per 8 hour",
        "statusFlag": 1
    },
    {
        "row": 581,
        "ucum_code": "ng\/kg\/h",
        "description": "nanogram per kilogram per hour",
        "statusFlag": 1
    },
    {
        "row": 582,
        "ucum_code": "ng\/kg\/min",
        "description": "nanogram per kilogram per minute",
        "statusFlag": 1
    },
    {
        "row": 583,
        "ucum_code": "ng\/L",
        "description": "nanogram per liter",
        "statusFlag": 1
    },
    {
        "row": 584,
        "ucum_code": "ng\/mg",
        "description": "nanogram per milligram",
        "statusFlag": 1
    },
    {
        "row": 585,
        "ucum_code": "ng\/mg{creat}",
        "description": "nanogram per milligram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 586,
        "ucum_code": "ng\/mg{prot}",
        "description": "nanogram per milligram of protein",
        "statusFlag": 1
    },
    {
        "row": 587,
        "ucum_code": "ng\/mg\/h",
        "description": "nanogram per milligram per hour",
        "statusFlag": 1
    },
    {
        "row": 588,
        "ucum_code": "ng\/mL{RBCs}",
        "description": "nanogram per milliliter of red blood cells",
        "statusFlag": 1
    },
    {
        "row": 589,
        "ucum_code": "ng\/mL\/h",
        "description": "nanogram per milliliter per hour",
        "statusFlag": 1
    },
    {
        "row": 590,
        "ucum_code": "ng\/10*6",
        "description": "nanogram per million",
        "statusFlag": 1
    },
    {
        "row": 591,
        "ucum_code": "ng\/10*6{RBCs}",
        "description": "nanogram per million red blood cells",
        "statusFlag": 1
    },
    {
        "row": 592,
        "ucum_code": "ng\/mL",
        "description": "nanogram per millliiter",
        "statusFlag": 1
    },
    {
        "row": 593,
        "ucum_code": "ng\/min",
        "description": "nanogram per minute",
        "statusFlag": 1
    },
    {
        "row": 594,
        "ucum_code": "ng\/s",
        "description": "nanogram per second",
        "statusFlag": 1
    },
    {
        "row": 595,
        "ucum_code": "ng\/m2",
        "description": "nanogram per square meter",
        "statusFlag": 1
    },
    {
        "row": 596,
        "ucum_code": "nkat",
        "description": "nanokatal",
        "statusFlag": 1
    },
    {
        "row": 597,
        "ucum_code": "nL",
        "description": "nanoliter",
        "statusFlag": 1
    },
    {
        "row": 598,
        "ucum_code": "nm",
        "description": "nanometer",
        "statusFlag": 1
    },
    {
        "row": 599,
        "ucum_code": "nm\/s\/L",
        "description": "nanometer per second per liter",
        "statusFlag": 1
    },
    {
        "row": 600,
        "ucum_code": "nmol",
        "description": "nanomole",
        "statusFlag": 1
    },
    {
        "row": 601,
        "ucum_code": "nmol{BCE}",
        "description": "nanomole bone collagen equivalent",
        "statusFlag": 1
    },
    {
        "row": 602,
        "ucum_code": "nmol{BCE}\/L",
        "description": "nanomole bone collagen equivalent per liter",
        "statusFlag": 1
    },
    {
        "row": 603,
        "ucum_code": "nmol\/mmol{creat}",
        "description": "nanomole bone collagen equivalent per millimole of creatinine",
        "statusFlag": 1
    },
    {
        "row": 604,
        "ucum_code": "nmol\/mg{prot}",
        "description": "nanomole of 1\/2 cystine per milligram of protein",
        "statusFlag": 1
    },
    {
        "row": 605,
        "ucum_code": "nmol{ATP}",
        "description": "nanomole of ATP ",
        "statusFlag": 1
    },
    {
        "row": 606,
        "ucum_code": "nmol\/(24.h)",
        "description": "nanomole per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 607,
        "ucum_code": "nmol\/d",
        "description": "nanomole per day",
        "statusFlag": 1
    },
    {
        "row": 608,
        "ucum_code": "nmol\/dL",
        "description": "nanomole per deciliter",
        "statusFlag": 1
    },
    {
        "row": 609,
        "ucum_code": "nmol\/dL{GF}",
        "description": "nanomole per deciliter of glomerular filtrate",
        "statusFlag": 1
    },
    {
        "row": 610,
        "ucum_code": "nmol\/g",
        "description": "nanomole per gram",
        "statusFlag": 1
    },
    {
        "row": 611,
        "ucum_code": "nmol\/g{creat}",
        "description": "nanomole per gram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 612,
        "ucum_code": "nmol\/g{dry_wt}",
        "description": "nanomole per gram of dry weight",
        "statusFlag": 1
    },
    {
        "row": 613,
        "ucum_code": "nmol\/h\/L",
        "description": "nanomole per hour per liter",
        "statusFlag": 1
    },
    {
        "row": 614,
        "ucum_code": "nmol\/h\/mg{prot}",
        "description": "nanomole per hour per milligram of protein",
        "statusFlag": 1
    },
    {
        "row": 615,
        "ucum_code": "nmol\/h\/mL",
        "description": "nanomole per hour per milliliter",
        "statusFlag": 1
    },
    {
        "row": 616,
        "ucum_code": "nmol\/L",
        "description": "nanomole per liter",
        "statusFlag": 1
    },
    {
        "row": 617,
        "ucum_code": "nmol\/L{RBCs}",
        "description": "nanomole per liter of red blood cells",
        "statusFlag": 1
    },
    {
        "row": 618,
        "ucum_code": "nmol\/L\/mmol{creat}",
        "description": "nanomole per liter per millimole of creatinine",
        "statusFlag": 1
    },
    {
        "row": 619,
        "ucum_code": "nmol\/m\/mg{prot}",
        "description": "nanomole per meter per milligram of protein",
        "statusFlag": 1
    },
    {
        "row": 620,
        "ucum_code": "nmol\/umol{creat}",
        "description": "nanomole per micromole  of creatinine",
        "statusFlag": 1
    },
    {
        "row": 621,
        "ucum_code": "nmol\/mg",
        "description": "nanomole per milligram",
        "statusFlag": 1
    },
    {
        "row": 622,
        "ucum_code": "nmol\/mg{creat}",
        "description": "nanomole per milligram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 623,
        "ucum_code": "nmol\/mg{prot}",
        "description": "nanomole per milligram of protein",
        "statusFlag": 1
    },
    {
        "row": 624,
        "ucum_code": "nmol\/mg{prot}\/h",
        "description": "nanomole per milligram of protein per hour",
        "statusFlag": 1
    },
    {
        "row": 625,
        "ucum_code": "nmol\/mg\/h",
        "description": "nanomole per milligram per hour",
        "statusFlag": 1
    },
    {
        "row": 626,
        "ucum_code": "nmol\/mL",
        "description": "nanomole per milliliter",
        "statusFlag": 1
    },
    {
        "row": 627,
        "ucum_code": "nmol\/mL\/h",
        "description": "nanomole per milliliter per hour",
        "statusFlag": 1
    },
    {
        "row": 628,
        "ucum_code": "nmol\/mL\/min",
        "description": "nanomole per milliliter per minute",
        "statusFlag": 1
    },
    {
        "row": 629,
        "ucum_code": "nmol\/mmol",
        "description": "nanomole per millimole",
        "statusFlag": 1
    },
    {
        "row": 630,
        "ucum_code": "nmol\/mmol{creat}",
        "description": "nanomole per millimole of creatinine",
        "statusFlag": 1
    },
    {
        "row": 631,
        "ucum_code": "nmol\/min",
        "description": "nanomole per minute",
        "statusFlag": 1
    },
    {
        "row": 632,
        "ucum_code": "nmol\/min\/mg{Hb}",
        "description": "nanomole per minute per milligram of hemoglobin",
        "statusFlag": 1
    },
    {
        "row": 633,
        "ucum_code": "nmol\/min\/mg{prot}",
        "description": "nanomole per minute per milligram of protein",
        "statusFlag": 1
    },
    {
        "row": 634,
        "ucum_code": "nmol\/min\/mg{protein}",
        "description": "nanomole per minute per milligram protein",
        "statusFlag": 1
    },
    {
        "row": 635,
        "ucum_code": "nmol\/min\/mL",
        "description": "nanomole per minute per milliliter",
        "statusFlag": 1
    },
    {
        "row": 636,
        "ucum_code": "nmol\/min\/10*6{cells}",
        "description": "nanomole per minute per million cells",
        "statusFlag": 1
    },
    {
        "row": 637,
        "ucum_code": "nmol\/mol",
        "description": "nanomole per mole",
        "statusFlag": 1
    },
    {
        "row": 638,
        "ucum_code": "nmol\/mol{creat}",
        "description": "nanomole per mole creatinine",
        "statusFlag": 1
    },
    {
        "row": 639,
        "ucum_code": "nmol\/nmol",
        "description": "nanomole per nanomole",
        "statusFlag": 1
    },
    {
        "row": 640,
        "ucum_code": "nmol\/s",
        "description": "nanomole per second",
        "statusFlag": 1
    },
    {
        "row": 641,
        "ucum_code": "nmol\/s\/L",
        "description": "nanomole per second per liter",
        "statusFlag": 1
    },
    {
        "row": 642,
        "ucum_code": "ns",
        "description": "nanosecond",
        "statusFlag": 1
    },
    {
        "row": 643,
        "ucum_code": "N",
        "description": "Newton",
        "statusFlag": 1
    },
    {
        "row": 644,
        "ucum_code": "N.cm",
        "description": "Newton centimeter",
        "statusFlag": 1
    },
    {
        "row": 645,
        "ucum_code": "N.s",
        "description": "Newton second",
        "statusFlag": 1
    },
    {
        "row": 646,
        "ucum_code": "{#}",
        "description": "number",
        "statusFlag": 1
    },
    {
        "row": 647,
        "ucum_code": "{#}\/a",
        "description": "number per annum (year)",
        "statusFlag": 1
    },
    {
        "row": 648,
        "ucum_code": "{#}\/d",
        "description": "number per day",
        "statusFlag": 1
    },
    {
        "row": 649,
        "ucum_code": "{#}\/g",
        "description": "number per gram",
        "statusFlag": 1
    },
    {
        "row": 650,
        "ucum_code": "{#}\/[HPF]",
        "description": "number per high power field",
        "statusFlag": 1
    },
    {
        "row": 651,
        "ucum_code": "{#}\/L",
        "description": "number per liter",
        "statusFlag": 1
    },
    {
        "row": 652,
        "ucum_code": "{#}\/[LPF]",
        "description": "number per low power field",
        "statusFlag": 1
    },
    {
        "row": 653,
        "ucum_code": "{#}\/uL",
        "description": "number per microliter",
        "statusFlag": 1
    },
    {
        "row": 654,
        "ucum_code": "{#}\/mL",
        "description": "number per milliliter",
        "statusFlag": 1
    },
    {
        "row": 655,
        "ucum_code": "{#}\/min",
        "description": "number per minute",
        "statusFlag": 1
    },
    {
        "row": 656,
        "ucum_code": "{#}\/wk",
        "description": "number per week",
        "statusFlag": 1
    },
    {
        "row": 657,
        "ucum_code": "Ohm",
        "description": "Ohm",
        "statusFlag": 1
    },
    {
        "row": 658,
        "ucum_code": "Ohm.m",
        "description": "Ohm meter",
        "statusFlag": 1
    },
    {
        "row": 659,
        "ucum_code": "10*5",
        "description": "one hundred thousand",
        "statusFlag": 1
    },
    {
        "row": 660,
        "ucum_code": "{OD_unit}",
        "description": "optical density unit",
        "statusFlag": 1
    },
    {
        "row": 661,
        "ucum_code": "osm",
        "description": "osmole",
        "statusFlag": 1
    },
    {
        "row": 662,
        "ucum_code": "osm\/kg",
        "description": "osmole per kilogram",
        "statusFlag": 1
    },
    {
        "row": 663,
        "ucum_code": "osm\/L",
        "description": "osmole per liter",
        "statusFlag": 1
    },
    {
        "row": 664,
        "ucum_code": "[oz_av]",
        "description": "ounce (US and British)",
        "statusFlag": 1
    },
    {
        "row": 665,
        "ucum_code": "{Pan_Bio'U}",
        "description": "panbio unit",
        "statusFlag": 1
    },
    {
        "row": 666,
        "ucum_code": "[ppb]",
        "description": "part per billion",
        "statusFlag": 1
    },
    {
        "row": 667,
        "ucum_code": "[ppm]",
        "description": "part per million",
        "statusFlag": 1
    },
    {
        "row": 668,
        "ucum_code": "[ppm]{v\/v}",
        "description": "part per million in volume per volume",
        "statusFlag": 1
    },
    {
        "row": 669,
        "ucum_code": "[ppth]",
        "description": "part per thousand",
        "statusFlag": 1
    },
    {
        "row": 670,
        "ucum_code": "[pptr]",
        "description": "part per trillion",
        "statusFlag": 1
    },
    {
        "row": 671,
        "ucum_code": "Pa",
        "description": "Pascal",
        "statusFlag": 1
    },
    {
        "row": 672,
        "ucum_code": "\/10*10",
        "description": "per 10 billion  ",
        "statusFlag": 1
    },
    {
        "row": 673,
        "ucum_code": "\/10*4{RBCs}",
        "description": "per 10 thousand red blood cells",
        "statusFlag": 1
    },
    {
        "row": 674,
        "ucum_code": "\/100",
        "description": "per 100",
        "statusFlag": 1
    },
    {
        "row": 675,
        "ucum_code": "\/100{cells}",
        "description": "per 100 cells",
        "statusFlag": 1
    },
    {
        "row": 676,
        "ucum_code": "\/100{neutrophils}",
        "description": "per 100 neutrophils",
        "statusFlag": 1
    },
    {
        "row": 677,
        "ucum_code": "\/100{spermatozoa}",
        "description": "per 100 spermatozoa",
        "statusFlag": 1
    },
    {
        "row": 678,
        "ucum_code": "\/100{WBCs}",
        "description": "per 100 white blood cells",
        "statusFlag": 1
    },
    {
        "row": 679,
        "ucum_code": "\/[arb'U]",
        "description": "per arbitrary unit",
        "statusFlag": 1
    },
    {
        "row": 680,
        "ucum_code": "\/10*9",
        "description": "per billion",
        "statusFlag": 1
    },
    {
        "row": 681,
        "ucum_code": "\/cm[H2O]",
        "description": "per centimeter of water",
        "statusFlag": 1
    },
    {
        "row": 682,
        "ucum_code": "\/m3",
        "description": "per cubic meter",
        "statusFlag": 1
    },
    {
        "row": 683,
        "ucum_code": "\/d",
        "description": "per day",
        "statusFlag": 1
    },
    {
        "row": 684,
        "ucum_code": "\/dL",
        "description": "per deciliter",
        "statusFlag": 1
    },
    {
        "row": 685,
        "ucum_code": "\/{entity}",
        "description": "per entity",
        "statusFlag": 1
    },
    {
        "row": 686,
        "ucum_code": "\/U",
        "description": "per enzyme unit",
        "statusFlag": 1
    },
    {
        "row": 687,
        "ucum_code": "\/g",
        "description": "per gram",
        "statusFlag": 1
    },
    {
        "row": 688,
        "ucum_code": "\/g{creat}",
        "description": "per gram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 689,
        "ucum_code": "\/g{Hb}",
        "description": "per gram of hemoglobin",
        "statusFlag": 1
    },
    {
        "row": 690,
        "ucum_code": "\/g{tot_nit}",
        "description": "per gram of total nitrogen",
        "statusFlag": 1
    },
    {
        "row": 691,
        "ucum_code": "\/g{tot_prot}",
        "description": "per gram of total protein",
        "statusFlag": 1
    },
    {
        "row": 692,
        "ucum_code": "\/g{wet_tis}",
        "description": "per gram of wet tissue",
        "statusFlag": 1
    },
    {
        "row": 693,
        "ucum_code": "\/[HPF]",
        "description": "per high power field",
        "statusFlag": 1
    },
    {
        "row": 694,
        "ucum_code": "\/h",
        "description": "per hour",
        "statusFlag": 1
    },
    {
        "row": 695,
        "ucum_code": "\/[IU]",
        "description": "per international unit",
        "statusFlag": 1
    },
    {
        "row": 696,
        "ucum_code": "\/kg",
        "description": "per kilogram",
        "statusFlag": 1
    },
    {
        "row": 697,
        "ucum_code": "\/kg{body_wt}",
        "description": "per kilogram of body weight",
        "statusFlag": 1
    },
    {
        "row": 698,
        "ucum_code": "\/L",
        "description": "per liter",
        "statusFlag": 1
    },
    {
        "row": 699,
        "ucum_code": "\/[LPF]",
        "description": "per low power field",
        "statusFlag": 1
    },
    {
        "row": 700,
        "ucum_code": "\/uL",
        "description": "per microliter",
        "statusFlag": 1
    },
    {
        "row": 701,
        "ucum_code": "\/mg",
        "description": "per milligram",
        "statusFlag": 1
    },
    {
        "row": 702,
        "ucum_code": "\/mL",
        "description": "per milliliter",
        "statusFlag": 1
    },
    {
        "row": 703,
        "ucum_code": "\/mm",
        "description": "per millimeter",
        "statusFlag": 1
    },
    {
        "row": 704,
        "ucum_code": "\/mmol{creat}",
        "description": "per millimole of creatinine",
        "statusFlag": 1
    },
    {
        "row": 705,
        "ucum_code": "\/10*6",
        "description": "per million",
        "statusFlag": 1
    },
    {
        "row": 706,
        "ucum_code": "\/min",
        "description": "per minute",
        "statusFlag": 1
    },
    {
        "row": 707,
        "ucum_code": "\/mo",
        "description": "per month",
        "statusFlag": 1
    },
    {
        "row": 708,
        "ucum_code": "\/{OIF}",
        "description": "per oil immersion field",
        "statusFlag": 1
    },
    {
        "row": 709,
        "ucum_code": "\/s",
        "description": "per second",
        "statusFlag": 1
    },
    {
        "row": 710,
        "ucum_code": "\/m2",
        "description": "per square meter",
        "statusFlag": 1
    },
    {
        "row": 711,
        "ucum_code": "\/10*3",
        "description": "per thousand",
        "statusFlag": 1
    },
    {
        "row": 712,
        "ucum_code": "\/10*3{RBCs}",
        "description": "per thousand red blood cells",
        "statusFlag": 1
    },
    {
        "row": 713,
        "ucum_code": "\/10*12",
        "description": "per trillion ",
        "statusFlag": 1
    },
    {
        "row": 714,
        "ucum_code": "\/10*12{RBCs}",
        "description": "per trillion red blood cells",
        "statusFlag": 1
    },
    {
        "row": 715,
        "ucum_code": "\/(12.h)",
        "description": "per twelve hour",
        "statusFlag": 1
    },
    {
        "row": 716,
        "ucum_code": "\/wk",
        "description": "per week",
        "statusFlag": 1
    },
    {
        "row": 717,
        "ucum_code": "\/a",
        "description": "per year",
        "statusFlag": 1
    },
    {
        "row": 718,
        "ucum_code": "%",
        "description": "percent",
        "statusFlag": 1
    },
    {
        "row": 719,
        "ucum_code": "%{loss_AChR}",
        "description": "percent  loss of acetylcholine receptor",
        "statusFlag": 1
    },
    {
        "row": 720,
        "ucum_code": "%{penetration}",
        "description": "percent  penetration",
        "statusFlag": 1
    },
    {
        "row": 721,
        "ucum_code": "%{abnormal}",
        "description": "percent abnormal",
        "statusFlag": 1
    },
    {
        "row": 722,
        "ucum_code": "%{activity}",
        "description": "percent activity",
        "statusFlag": 1
    },
    {
        "row": 723,
        "ucum_code": "%{aggregation}",
        "description": "percent aggregation",
        "statusFlag": 1
    },
    {
        "row": 724,
        "ucum_code": "%{at_60_min}",
        "description": "percent at 60 minute",
        "statusFlag": 1
    },
    {
        "row": 725,
        "ucum_code": "%{basal_activity}",
        "description": "percent basal activity",
        "statusFlag": 1
    },
    {
        "row": 726,
        "ucum_code": "%{binding}",
        "description": "percent binding",
        "statusFlag": 1
    },
    {
        "row": 727,
        "ucum_code": "%{blockade}",
        "description": "percent blockade",
        "statusFlag": 1
    },
    {
        "row": 728,
        "ucum_code": "%{blocked}",
        "description": "percent blocked",
        "statusFlag": 1
    },
    {
        "row": 729,
        "ucum_code": "%{bound}",
        "description": "percent bound",
        "statusFlag": 1
    },
    {
        "row": 730,
        "ucum_code": "%{breakdown}",
        "description": "percent breakdown",
        "statusFlag": 1
    },
    {
        "row": 731,
        "ucum_code": "%{vol}",
        "description": "percent by volume",
        "statusFlag": 1
    },
    {
        "row": 732,
        "ucum_code": "%{deficient}",
        "description": "percent deficient",
        "statusFlag": 1
    },
    {
        "row": 733,
        "ucum_code": "%{dose}",
        "description": "percent dose",
        "statusFlag": 1
    },
    {
        "row": 734,
        "ucum_code": "%{excretion}",
        "description": "percent excretion",
        "statusFlag": 1
    },
    {
        "row": 735,
        "ucum_code": "%{Hb}",
        "description": "percent hemoglobin",
        "statusFlag": 1
    },
    {
        "row": 736,
        "ucum_code": "%{hemolysis}",
        "description": "percent hemolysis",
        "statusFlag": 1
    },
    {
        "row": 737,
        "ucum_code": "%{index}",
        "description": "percent index",
        "statusFlag": 1
    },
    {
        "row": 738,
        "ucum_code": "%{inhibition}",
        "description": "percent inhibition",
        "statusFlag": 1
    },
    {
        "row": 739,
        "ucum_code": "%{loss}",
        "description": "percent loss",
        "statusFlag": 1
    },
    {
        "row": 740,
        "ucum_code": "%{lysis}",
        "description": "percent lysis",
        "statusFlag": 1
    },
    {
        "row": 741,
        "ucum_code": "%{normal}",
        "description": "percent normal",
        "statusFlag": 1
    },
    {
        "row": 742,
        "ucum_code": "%{pooled_plasma}",
        "description": "percent normal pooled plasma",
        "statusFlag": 1
    },
    {
        "row": 743,
        "ucum_code": "%{bacteria}",
        "description": "percent of bacteria",
        "statusFlag": 1
    },
    {
        "row": 744,
        "ucum_code": "%{baseline}",
        "description": "percent of baseline",
        "statusFlag": 1
    },
    {
        "row": 745,
        "ucum_code": "%{cells}",
        "description": "percent of cells",
        "statusFlag": 1
    },
    {
        "row": 746,
        "ucum_code": "%{RBCs}",
        "description": "percent of red blood cells",
        "statusFlag": 1
    },
    {
        "row": 747,
        "ucum_code": "%{WBCs}",
        "description": "percent of white blood cells",
        "statusFlag": 1
    },
    {
        "row": 748,
        "ucum_code": "%{positive}",
        "description": "percent positive",
        "statusFlag": 1
    },
    {
        "row": 749,
        "ucum_code": "%{reactive}",
        "description": "percent reactive",
        "statusFlag": 1
    },
    {
        "row": 750,
        "ucum_code": "%{recovery}",
        "description": "percent recovery",
        "statusFlag": 1
    },
    {
        "row": 751,
        "ucum_code": "%{reference}",
        "description": "percent reference",
        "statusFlag": 1
    },
    {
        "row": 752,
        "ucum_code": "%{residual}",
        "description": "percent residual",
        "statusFlag": 1
    },
    {
        "row": 753,
        "ucum_code": "%{response}",
        "description": "percent response",
        "statusFlag": 1
    },
    {
        "row": 754,
        "ucum_code": "%{saturation}",
        "description": "percent saturation",
        "statusFlag": 1
    },
    {
        "row": 755,
        "ucum_code": "%{total}",
        "description": "percent total",
        "statusFlag": 1
    },
    {
        "row": 756,
        "ucum_code": "%{uptake}",
        "description": "percent uptake",
        "statusFlag": 1
    },
    {
        "row": 757,
        "ucum_code": "%{viable}",
        "description": "percent viable",
        "statusFlag": 1
    },
    {
        "row": 758,
        "ucum_code": "{percentile}",
        "description": "percentile",
        "statusFlag": 1
    },
    {
        "row": 759,
        "ucum_code": "[pH]",
        "description": "pH",
        "statusFlag": 1
    },
    {
        "row": 760,
        "ucum_code": "{phenotype}",
        "description": "phenotype",
        "statusFlag": 1
    },
    {
        "row": 761,
        "ucum_code": "pA",
        "description": "picoampere",
        "statusFlag": 1
    },
    {
        "row": 762,
        "ucum_code": "pg",
        "description": "picogram",
        "statusFlag": 1
    },
    {
        "row": 763,
        "ucum_code": "pg\/{cell}",
        "description": "picogram per cell",
        "statusFlag": 1
    },
    {
        "row": 764,
        "ucum_code": "pg\/dL",
        "description": "picogram per deciliter",
        "statusFlag": 1
    },
    {
        "row": 765,
        "ucum_code": "pg\/L",
        "description": "picogram per liter",
        "statusFlag": 1
    },
    {
        "row": 766,
        "ucum_code": "pg\/mg",
        "description": "picogram per milligram",
        "statusFlag": 1
    },
    {
        "row": 767,
        "ucum_code": "pg\/mg{creat}",
        "description": "picogram per milligram of creatinine",
        "statusFlag": 1
    },
    {
        "row": 768,
        "ucum_code": "pg\/mL",
        "description": "picogram per milliliter",
        "statusFlag": 1
    },
    {
        "row": 769,
        "ucum_code": "pg\/mL{sLT}",
        "description": "picogram per milliliter sulfidoleukotrienes",
        "statusFlag": 1
    },
    {
        "row": 770,
        "ucum_code": "pg\/mm",
        "description": "picogram per millimeter",
        "statusFlag": 1
    },
    {
        "row": 771,
        "ucum_code": "pg\/{RBC}",
        "description": "picogram per red blood cell",
        "statusFlag": 1
    },
    {
        "row": 772,
        "ucum_code": "pkat",
        "description": "picokatal",
        "statusFlag": 1
    },
    {
        "row": 773,
        "ucum_code": "pL",
        "description": "picoliter",
        "statusFlag": 1
    },
    {
        "row": 774,
        "ucum_code": "pm",
        "description": "picometer",
        "statusFlag": 1
    },
    {
        "row": 775,
        "ucum_code": "pmol",
        "description": "picomole",
        "statusFlag": 1
    },
    {
        "row": 776,
        "ucum_code": "pmol\/(24.h)",
        "description": "picomole per 24 hour",
        "statusFlag": 1
    },
    {
        "row": 777,
        "ucum_code": "pmol\/d",
        "description": "picomole per day",
        "statusFlag": 1
    },
    {
        "row": 778,
        "ucum_code": "pmol\/dL",
        "description": "picomole per deciliter",
        "statusFlag": 1
    },
    {
        "row": 779,
        "ucum_code": "pmol\/g",
        "description": "picomole per gram",
        "statusFlag": 1
    },
    {
        "row": 780,
        "ucum_code": "pmol\/h\/mg{prot}",
        "description": "picomole per hour per milligram of protein",
        "statusFlag": 1
    },
    {
        "row": 781,
        "ucum_code": "pmol\/H\/mg{protein}",
        "description": "picomole per hour per milligram protein",
        "statusFlag": 1
    },
    {
        "row": 782,
        "ucum_code": "pmol\/h\/mL",
        "description": "picomole per hour per milliliter ",
        "statusFlag": 1
    },
    {
        "row": 783,
        "ucum_code": "pmol\/L",
        "description": "picomole per liter",
        "statusFlag": 1
    },
    {
        "row": 784,
        "ucum_code": "pmol\/umol",
        "description": "picomole per micromole",
        "statusFlag": 1
    },
    {
        "row": 785,
        "ucum_code": "pmol\/umol{creat}",
        "description": "picomole per micromole of creatinine",
        "statusFlag": 1
    },
    {
        "row": 786,
        "ucum_code": "pmol\/mg{prot}",
        "description": "picomole per milligram of protein",
        "statusFlag": 1
    },
    {
        "row": 787,
        "ucum_code": "pmol\/mL",
        "description": "picomole per milliliter",
        "statusFlag": 1
    },
    {
        "row": 788,
        "ucum_code": "pmol\/mmol{creat}",
        "description": "picomole per millimole of creatinine",
        "statusFlag": 1
    },
    {
        "row": 789,
        "ucum_code": "pmol\/min",
        "description": "picomole per minute",
        "statusFlag": 1
    },
    {
        "row": 790,
        "ucum_code": "pmol\/min\/mg{prot}",
        "description": "picomole per minute per milligram of protein",
        "statusFlag": 1
    },
    {
        "row": 791,
        "ucum_code": "pmol\/{RBC}",
        "description": "picomole per red blood cell",
        "statusFlag": 1
    },
    {
        "row": 792,
        "ucum_code": "ps",
        "description": "picosecond",
        "statusFlag": 1
    },
    {
        "row": 793,
        "ucum_code": "pT",
        "description": "picotesla",
        "statusFlag": 1
    },
    {
        "row": 794,
        "ucum_code": "[pt_us]",
        "description": "pint (US)",
        "statusFlag": 1
    },
    {
        "row": 795,
        "ucum_code": "[lb_av]",
        "description": "pound (US and British)",
        "statusFlag": 1
    },
    {
        "row": 796,
        "ucum_code": "[psi]",
        "description": "pound per square inch",
        "statusFlag": 1
    },
    {
        "row": 797,
        "ucum_code": "[qt_us]",
        "description": "quart (US)",
        "statusFlag": 1
    },
    {
        "row": 798,
        "ucum_code": "{ratio}",
        "description": "ratio",
        "statusFlag": 1
    },
    {
        "row": 799,
        "ucum_code": "{RBC}\/uL",
        "description": "red blood cell per microliter",
        "statusFlag": 1
    },
    {
        "row": 800,
        "ucum_code": "%{relative}",
        "description": "relative percent",
        "statusFlag": 1
    },
    {
        "row": 801,
        "ucum_code": "{rel_saturation}",
        "description": "relative saturation",
        "statusFlag": 1
    },
    {
        "row": 802,
        "ucum_code": "{risk}",
        "description": "risk",
        "statusFlag": 1
    },
    {
        "row": 803,
        "ucum_code": "{Rubella_virus}",
        "description": "rubella virus",
        "statusFlag": 1
    },
    {
        "row": 804,
        "ucum_code": "{saturation}",
        "description": "saturation",
        "statusFlag": 1
    },
    {
        "row": 805,
        "ucum_code": "{score}",
        "description": "score",
        "statusFlag": 1
    },
    {
        "row": 806,
        "ucum_code": "s",
        "description": "second",
        "statusFlag": 1
    },
    {
        "row": 807,
        "ucum_code": "s\/{control}",
        "description": "second per control",
        "statusFlag": 1
    },
    {
        "row": 808,
        "ucum_code": "{shift}",
        "description": "shift",
        "statusFlag": 1
    },
    {
        "row": 809,
        "ucum_code": "S",
        "description": "Siemens",
        "statusFlag": 1
    },
    {
        "row": 810,
        "ucum_code": "Sv",
        "description": "Sievert",
        "statusFlag": 1
    },
    {
        "row": 811,
        "ucum_code": "{s_co_ratio}",
        "description": "signal to cutoff ratio",
        "statusFlag": 1
    },
    {
        "row": 812,
        "ucum_code": "{spermatozoa}\/mL",
        "description": "spermatozoa per milliliter",
        "statusFlag": 1
    },
    {
        "row": 813,
        "ucum_code": "cm2",
        "description": "square centimeter",
        "statusFlag": 1
    },
    {
        "row": 814,
        "ucum_code": "cm2\/s",
        "description": "square centimeter per second",
        "statusFlag": 1
    },
    {
        "row": 815,
        "ucum_code": "dm2\/s2",
        "description": "square decimeter per square second",
        "statusFlag": 1
    },
    {
        "row": 816,
        "ucum_code": "[sft_i]",
        "description": "square foot (international)",
        "statusFlag": 1
    },
    {
        "row": 817,
        "ucum_code": "[sin_i]",
        "description": "square inch (international)",
        "statusFlag": 1
    },
    {
        "row": 818,
        "ucum_code": "m2",
        "description": "square meter",
        "statusFlag": 1
    },
    {
        "row": 819,
        "ucum_code": "m2\/s",
        "description": "square meter per second",
        "statusFlag": 1
    },
    {
        "row": 820,
        "ucum_code": "mm2",
        "description": "square millimeter",
        "statusFlag": 1
    },
    {
        "row": 821,
        "ucum_code": "[syd_i]",
        "description": "square yard (international)",
        "statusFlag": 1
    },
    {
        "row": 822,
        "ucum_code": "{STDV}",
        "description": "standard deviation",
        "statusFlag": 1
    },
    {
        "row": 823,
        "ucum_code": "{Tscore}",
        "description": "t score",
        "statusFlag": 1
    },
    {
        "row": 824,
        "ucum_code": "[tbs_us]",
        "description": "tablespoon (US)",
        "statusFlag": 1
    },
    {
        "row": 825,
        "ucum_code": "[tsp_us]",
        "description": "teaspoon (US)",
        "statusFlag": 1
    },
    {
        "row": 826,
        "ucum_code": "T",
        "description": "Tesla",
        "statusFlag": 1
    },
    {
        "row": 827,
        "ucum_code": "10*3",
        "description": "thousand",
        "statusFlag": 1
    },
    {
        "row": 828,
        "ucum_code": "10*3{copies}\/mL",
        "description": "thousand copies per milliliter",
        "statusFlag": 1
    },
    {
        "row": 829,
        "ucum_code": "10*3\/L",
        "description": "thousand per liter",
        "statusFlag": 1
    },
    {
        "row": 830,
        "ucum_code": "10*3\/uL",
        "description": "thousand per microliter",
        "statusFlag": 1
    },
    {
        "row": 831,
        "ucum_code": "10*3\/mL",
        "description": "thousand per milliliter",
        "statusFlag": 1
    },
    {
        "row": 832,
        "ucum_code": "10*3{RBCs}",
        "description": "thousand red blood cells",
        "statusFlag": 1
    },
    {
        "row": 833,
        "ucum_code": "{TSI_index}",
        "description": "thyroid-stimulating immunoglobulin index",
        "statusFlag": 1
    },
    {
        "row": 834,
        "ucum_code": "{TmStp}",
        "description": "time stamp",
        "statusFlag": 1
    },
    {
        "row": 835,
        "ucum_code": "{titer}",
        "description": "titer",
        "statusFlag": 1
    },
    {
        "row": 836,
        "ucum_code": "[todd'U]",
        "description": "Todd unit",
        "statusFlag": 1
    },
    {
        "row": 837,
        "ucum_code": "Torr",
        "description": "Torr \n",
        "statusFlag": 1
    },
    {
        "row": 838,
        "ucum_code": "10*12\/L",
        "description": "trillion per liter",
        "statusFlag": 1
    },
    {
        "row": 839,
        "ucum_code": "[oz_tr]",
        "description": "Troy ounce",
        "statusFlag": 1
    },
    {
        "row": 840,
        "ucum_code": "[tb'U]",
        "description": "tuberculin unit",
        "statusFlag": 1
    },
    {
        "row": 841,
        "ucum_code": "V",
        "description": "volt",
        "statusFlag": 1
    },
    {
        "row": 842,
        "ucum_code": "Wb",
        "description": "Weber",
        "statusFlag": 1
    },
    {
        "row": 843,
        "ucum_code": "wk",
        "description": "week",
        "statusFlag": 1
    },
    {
        "row": 844,
        "ucum_code": "{WBCs}",
        "description": "white blood cells",
        "statusFlag": 1
    },
    {
        "row": 845,
        "ucum_code": "[yd_i]",
        "description": "yard (international)",
        "statusFlag": 1
    },
    {
        "row": 846,
        "ucum_code": "a",
        "description": "year",
        "statusFlag": 1
    },
    {
        "row": 847,
        "ucum_code": "{yyyy}",
        "description": "year",
        "statusFlag": 1
    },
    {
        "row": 848,
        "ucum_code": "{Zscore}",
        "description": "z score",
        "statusFlag": 1
    }
]

export default units