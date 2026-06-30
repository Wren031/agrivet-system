export interface Region {
  code: string;
  name: string;
}

export interface Province {
  code: string;
  name: string;
  regionCode: string;
}

export interface CityMunicipality {
  code: string;
  name: string;
  provinceCode: string;
}

export interface Barangay {
  code: string;
  name: string;
  cityCode: string;
}

export const regions: Region[] = [
  { code: "01", name: "National Capital Region (NCR)" },
  { code: "02", name: "Cordillera Administrative Region (CAR)" },
  { code: "03", name: "Region I - Ilocos Region" },
  { code: "04", name: "Region II - Cagayan Valley" },
  { code: "05", name: "Region III - Central Luzon" },
  { code: "06", name: "Region IV-A - CALABARZON" },
  { code: "07", name: "Region IV-B - MIMAROPA" },
  { code: "08", name: "Region V - Bicol Region" },
  { code: "09", name: "Region VI - Western Visayas" },
  { code: "10", name: "Region VII - Central Visayas" },
  { code: "11", name: "Region VIII - Eastern Visayas" },
  { code: "12", name: "Region IX - Zamboanga Peninsula" },
  { code: "13", name: "Region X - Northern Mindanao" },
  { code: "14", name: "Region XI - Davao Region" },
  { code: "15", name: "Region XII - SOCCSKSARGEN" },
  { code: "16", name: "Region XIII - Caraga" },
  { code: "17", name: "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)" },
];

export const provinces: Province[] = [
  // NCR
  { code: "ncr", name: "Metro Manila", regionCode: "01" },

  // CAR
  { code: "ab", name: "Abra", regionCode: "02" },
  { code: "ap", name: "Apayao", regionCode: "02" },
  { code: "bg", name: "Benguet", regionCode: "02" },
  { code: "if", name: "Ifugao", regionCode: "02" },
  { code: "k", name: "Kalinga", regionCode: "02" },
  { code: "mtp", name: "Mountain Province", regionCode: "02" },

  // Region I
  { code: "in", name: "Ilocos Norte", regionCode: "03" },
  { code: "is", name: "Ilocos Sur", regionCode: "03" },
  { code: "lu", name: "La Union", regionCode: "03" },
  { code: "pg", name: "Pangasinan", regionCode: "03" },

  // Region II
  { code: "bt", name: "Batanes", regionCode: "04" },
  { code: "cg", name: "Cagayan", regionCode: "04" },
  { code: "isab", name: "Isabela", regionCode: "04" },
  { code: "nvz", name: "Nueva Vizcaya", regionCode: "04" },
  { code: "q", name: "Quirino", regionCode: "04" },

  // Region III
  { code: "a", name: "Aurora", regionCode: "05" },
  { code: "b", name: "Bataan", regionCode: "05" },
  { code: "be", name: "Bulacan", regionCode: "05" },
  { code: "ne", name: "Nueva Ecija", regionCode: "05" },
  { code: "pa", name: "Pampanga", regionCode: "05" },
  { code: "ta", name: "Tarlac", regionCode: "05" },
  { code: "za", name: "Zambales", regionCode: "05" },

  // Region IV-A
  { code: "ba", name: "Batangas", regionCode: "06" },
  { code: "ca", name: "Cavite", regionCode: "06" },
  { code: "la", name: "Laguna", regionCode: "06" },
  { code: "qe", name: "Quezon", regionCode: "06" },
  { code: "ri", name: "Rizal", regionCode: "06" },

  // Region IV-B
  { code: "mr", name: "Marinduque", regionCode: "07" },
  { code: "md", name: "Mindoro Occidental", regionCode: "07" },
  { code: "mdr", name: "Mindoro Oriental", regionCode: "07" },
  { code: "pl", name: "Palawan", regionCode: "07" },
  { code: "rb", name: "Romblon", regionCode: "07" },

  // Region V
  { code: "al", name: "Albay", regionCode: "08" },
  { code: "cs", name: "Camarines Sur", regionCode: "08" },
  { code: "cn", name: "Camarines Norte", regionCode: "08" },
  { code: "ct", name: "Catanduanes", regionCode: "08" },
  { code: "ms", name: "Masbate", regionCode: "08" },
  { code: "sor", name: "Sorsogon", regionCode: "08" },

  // Region VI
  { code: "ak", name: "Aklan", regionCode: "09" },
  { code: "an", name: "Antique", regionCode: "09" },
  { code: "cp", name: "Capiz", regionCode: "09" },
  { code: "gi", name: "Guimaras", regionCode: "09" },
  { code: "ilo", name: "Iloilo", regionCode: "09" },
  { code: "nv", name: "Negros Occidental", regionCode: "09" },

  // Region VII
  { code: "boh", name: "Bohol", regionCode: "10" },
  { code: "ceb", name: "Cebu", regionCode: "10" },
  { code: "sie", name: "Siquijor", regionCode: "10" },
  { code: "negs", name: "Negros Oriental", regionCode: "10" },

  // Region VIII
  { code: "bil", name: "Biliran", regionCode: "11" },
  { code: "es", name: "Eastern Samar", regionCode: "11" },
  { code: "ley", name: "Leyte", regionCode: "11" },
  { code: "nso", name: "Northern Samar", regionCode: "11" },
  { code: "sam", name: "Samar", regionCode: "11" },
  { code: "sle", name: "Southern Leyte", regionCode: "11" },

  // Region IX
  { code: "zsn", name: "Zamboanga del Norte", regionCode: "12" },
  { code: "zss", name: "Zamboanga del Sur", regionCode: "12" },
  { code: "zsb", name: "Zamboanga Sibugay", regionCode: "12" },

  // Region X
  { code: "buk", name: "Bukidnon", regionCode: "13" },
  { code: "cam", name: "Camiguin", regionCode: "13" },
  { code: "lan", name: "Lanao del Norte", regionCode: "13" },
  { code: "misw", name: "Misamis Occidental", regionCode: "13" },
  { code: "miso", name: "Misamis Oriental", regionCode: "13" },

  // Region XI
  { code: "davn", name: "Davao del Norte", regionCode: "14" },
  { code: "davs", name: "Davao del Sur", regionCode: "14" },
  { code: "davo", name: "Davao Oriental", regionCode: "14" },
  { code: "davoc", name: "Davao Occidental", regionCode: "14" },
  { code: "davor", name: "Davao de Oro", regionCode: "14" },

  // Region XII
  { code: "nco", name: "North Cotabato", regionCode: "15" },
  { code: "sco", name: "South Cotabato", regionCode: "15" },
  { code: "suk", name: "Sultan Kudarat", regionCode: "15" },
  { code: "sar", name: "Sarangani", regionCode: "15" },

  // Region XIII
  { code: "agn", name: "Agusan del Norte", regionCode: "16" },
  { code: "ags", name: "Agusan del Sur", regionCode: "16" },
  { code: "din", name: "Dinagat Islands", regionCode: "16" },
  { code: "sun", name: "Surigao del Norte", regionCode: "16" },
  { code: "sus", name: "Surigao del Sur", regionCode: "16" },

  // BARMM
  { code: "bas", name: "Basilan", regionCode: "17" },
  { code: "law", name: "Lanao del Sur", regionCode: "17" },
  { code: "mag", name: "Maguindanao", regionCode: "17" },
  { code: "sul", name: "Sulu", regionCode: "17" },
  { code: "taw", name: "Tawi-Tawi", regionCode: "17" },
];

export const cities: CityMunicipality[] = [
  // Metro Manila
  { code: "mnl", name: "Manila", provinceCode: "ncr" },
  { code: "qzn", name: "Quezon City", provinceCode: "ncr" },
  { code: "cal", name: "Caloocan", provinceCode: "ncr" },
  { code: "mtp", name: "Makati", provinceCode: "ncr" },
  { code: "tag", name: "Taguig", provinceCode: "ncr" },
  { code: "psg", name: "Pasig", provinceCode: "ncr" },
  { code: "par", name: "Parañaque", provinceCode: "ncr" },
  { code: "las", name: "Las Piñas", provinceCode: "ncr" },
  { code: "mun", name: "Muntinlupa", provinceCode: "ncr" },
  { code: "mdy", name: "Mandaluyong", provinceCode: "ncr" },
  { code: "mk", name: "Marikina", provinceCode: "ncr" },
  { code: "psi", name: "Pasay", provinceCode: "ncr" },
  { code: "mal", name: "Malabon", provinceCode: "ncr" },
  { code: "nav", name: "Navotas", provinceCode: "ncr" },
  { code: "val", name: "Valenzuela", provinceCode: "ncr" },
  { code: "san", name: "San Juan", provinceCode: "ncr" },
  { code: "pateros", name: "Pateros", provinceCode: "ncr" },

  // Benguet
  { code: "bag", name: "Baguio City", provinceCode: "bg" },
  { code: "la", name: "La Trinidad", provinceCode: "bg" },

  // Ilocos Norte
  { code: "lvc", name: "Laoag City", provinceCode: "in" },
  { code: "batac", name: "Batac", provinceCode: "in" },

  // Ilocos Sur
  { code: "vgn", name: "Vigan City", provinceCode: "is" },
  { code: "cndn", name: "Candon", provinceCode: "is" },

  // La Union
  { code: "sfe", name: "San Fernando City", provinceCode: "lu" },

  // Pangasinan
  { code: "dag", name: "Dagupan City", provinceCode: "pg" },
  { code: "alaminos", name: "Alaminos", provinceCode: "pg" },
  { code: "sclos", name: "San Carlos City", provinceCode: "pg" },
  { code: "urd", name: "Urdaneta", provinceCode: "pg" },

  // Cagayan
  { code: "tgue", name: "Tuguegarao City", provinceCode: "cg" },

  // Isabela
  { code: "cau", name: "Cauayan", provinceCode: "isab" },
  { code: "ilgn", name: "Ilagan", provinceCode: "isab" },
  { code: "sntg", name: "Santiago City", provinceCode: "isab" },

  // Bulacan
  { code: "mlos", name: "Malolos", provinceCode: "be" },
  { code: "meyc", name: "Meycauayan", provinceCode: "be" },
  { code: "sjm", name: "San Jose del Monte", provinceCode: "be" },

  // Pampanga
  { code: "sf", name: "San Fernando City", provinceCode: "pa" },
  { code: "ang", name: "Angeles City", provinceCode: "pa" },
  { code: "mblc", name: "Mabalacat", provinceCode: "pa" },

  // Tarlac
  { code: "trl", name: "Tarlac City", provinceCode: "ta" },

  // Batangas
  { code: "bats", name: "Batangas City", provinceCode: "ba" },
  { code: "lipa", name: "Lipa City", provinceCode: "ba" },
  { code: "tan", name: "Tanauan", provinceCode: "ba" },

  // Cavite
  { code: "dsm", name: "Dasmarinas", provinceCode: "ca" },
  { code: "bac", name: "Bacoor", provinceCode: "ca" },
  { code: "gen", name: "General Trias", provinceCode: "ca" },
  { code: "im", name: "Imus", provinceCode: "ca" },
  { code: "trc", name: "Trece Martires", provinceCode: "ca" },
  { code: "cvt", name: "Cavite City", provinceCode: "ca" },
  { code: "tagay", name: "Tagaytay", provinceCode: "ca" },

  // Laguna
  { code: "calb", name: "Calamba", provinceCode: "la" },
  { code: "bins", name: "Biñan", provinceCode: "la" },
  { code: "sta_r", name: "Santa Rosa", provinceCode: "la" },
  { code: "san_p", name: "San Pablo City", provinceCode: "la" },
  { code: "cabu", name: "Cabuyao", provinceCode: "la" },

  // Rizal
  { code: "ant", name: "Antipolo", provinceCode: "ri" },

  // Palawan
  { code: "ppr", name: "Puerto Princesa City", provinceCode: "pl" },

  // Albay
  { code: "leg", name: "Legazpi City", provinceCode: "al" },
  { code: "tab", name: "Tabaco", provinceCode: "al" },
  { code: "lig", name: "Ligao", provinceCode: "al" },

  // Camarines Sur
  { code: "nag", name: "Naga City", provinceCode: "cs" },
  { code: "irg", name: "Iriga", provinceCode: "cs" },

  // Iloilo
  { code: "ilo_c", name: "Iloilo City", provinceCode: "ilo" },
  { code: "psg_c", name: "Passi City", provinceCode: "ilo" },

  // Negros Occidental
  { code: "bcd", name: "Bacolod City", provinceCode: "nv" },
  { code: "sil", name: "Silay", provinceCode: "nv" },
  { code: "talis", name: "Talisay", provinceCode: "nv" },

  // Cebu
  { code: "ceb_c", name: "Cebu City", provinceCode: "ceb" },
  { code: "lapu", name: "Lapu-Lapu City", provinceCode: "ceb" },
  { code: "mand", name: "Mandaue City", provinceCode: "ceb" },
  { code: "talis_c", name: "Talisay City", provinceCode: "ceb" },
  { code: "tledo", name: "Toledo", provinceCode: "ceb" },

  // Bohol
  { code: "tagb", name: "Tagbilaran", provinceCode: "boh" },

  // Leyte
  { code: "tacl", name: "Tacloban City", provinceCode: "ley" },
  { code: "orm", name: "Ormoc City", provinceCode: "ley" },

  // Zamboanga del Sur
  { code: "zambo", name: "Zamboanga City", provinceCode: "zss" },
  { code: "pgdn", name: "Pagadian", provinceCode: "zss" },

  // Bukidnon
  { code: "mlay", name: "Malaybalay", provinceCode: "buk" },
  { code: "val_c", name: "Valencia City", provinceCode: "buk" },

  // Misamis Oriental
  { code: "cdo", name: "Cagayan de Oro City", provinceCode: "miso" },
  { code: "ging", name: "Gingoog", provinceCode: "miso" },

  // Davao del Sur
  { code: "dvo", name: "Davao City", provinceCode: "davs" },
  { code: "digos", name: "Digos", provinceCode: "davs" },

  // Davao del Norte
  { code: "tagum", name: "Tagum", provinceCode: "davn" },
  { code: "panabo", name: "Panabo", provinceCode: "davn" },

  // South Cotabato
  { code: "gensan", name: "General Santos City", provinceCode: "sco" },
  { code: "kor", name: "Koronadal", provinceCode: "sco" },

  // Agusan del Norte
  { code: "but", name: "Butuan City", provinceCode: "agn" },

  // Surigao del Norte
  { code: "surig", name: "Surigao City", provinceCode: "sun" },

  // Lanao del Sur
  { code: "mar", name: "Marawi City", provinceCode: "law" },

  // Abra
  { code: "bng", name: "Bangued", provinceCode: "ab" },

  // Apayao
  { code: "cnr", name: "Conner", provinceCode: "ap" },

  // Ifugao
  { code: "lgve", name: "Lagawe", provinceCode: "if" },

  // Kalinga
  { code: "tbk", name: "Tabuk City", provinceCode: "k" },

  // Mountain Province
  { code: "bntc", name: "Bontoc", provinceCode: "mtp" },

  // Batanes
  { code: "bsco", name: "Basco", provinceCode: "bt" },

  // Nueva Vizcaya
  { code: "bmbg", name: "Bambang", provinceCode: "nvz" },

  // Quirino
  { code: "cbr", name: "Cabarroguis", provinceCode: "q" },

  // Aurora
  { code: "blr", name: "Baler", provinceCode: "a" },

  // Bataan
  { code: "blng", name: "Balanga", provinceCode: "b" },
  { code: "mrvc", name: "Mariveles", provinceCode: "b" },

  // Nueva Ecija
  { code: "plyn", name: "Palayan City", provinceCode: "ne" },
  { code: "cbn", name: "Cabanatuan City", provinceCode: "ne" },

  // Zambales
  { code: "olng", name: "Olongapo City", provinceCode: "za" },
  { code: "ib", name: "Iba", provinceCode: "za" },

  // Quezon
  { code: "lucn", name: "Lucena City", provinceCode: "qe" },
  { code: "tn", name: "Tayabas", provinceCode: "qe" },

  // Marinduque
  { code: "bgy", name: "Boac", provinceCode: "mr" },

  // Occidental Mindoro
  { code: "mdc", name: "Mamburao", provinceCode: "md" },

  // Oriental Mindoro
  { code: "clpn", name: "Calapan", provinceCode: "mdr" },

  // Romblon
  { code: "rmb", name: "Romblon", provinceCode: "rb" },

  // Camarines Norte
  { code: "daet", name: "Daet", provinceCode: "cn" },

  // Catanduanes
  { code: "vrac", name: "Virac", provinceCode: "ct" },

  // Masbate
  { code: "msb", name: "Masbate City", provinceCode: "ms" },

  // Sorsogon
  { code: "srg", name: "Sorsogon City", provinceCode: "sor" },

  // Aklan
  { code: "klb", name: "Kalibo", provinceCode: "ak" },

  // Antique
  { code: "sjd", name: "San Jose de Buenavista", provinceCode: "an" },

  // Capiz
  { code: "rxs", name: "Roxas City", provinceCode: "cp" },

  // Guimaras
  { code: "jrdn", name: "Jordan", provinceCode: "gi" },

  // Siquijor
  { code: "sqj", name: "Siquijor", provinceCode: "sie" },

  // Negros Oriental
  { code: "dmg", name: "Dumaguete City", provinceCode: "negs" },
  { code: "bais", name: "Bais City", provinceCode: "negs" },

  // Biliran
  { code: "nvl", name: "Naval", provinceCode: "bil" },

  // Eastern Samar
  { code: "brgn", name: "Borongan City", provinceCode: "es" },

  // Northern Samar
  { code: "catm", name: "Catarman", provinceCode: "nso" },

  // Samar
  { code: "clbg", name: "Calbayog City", provinceCode: "sam" },
  { code: "cbc", name: "Catbalogan", provinceCode: "sam" },

  // Southern Leyte
  { code: "ms", name: "Maasin City", provinceCode: "sle" },

  // Zamboanga del Norte
  { code: "dpc", name: "Dipolog City", provinceCode: "zsn" },
  { code: "drt", name: "Dapitan City", provinceCode: "zsn" },

  // Zamboanga Sibugay
  { code: "ipt", name: "Ipil", provinceCode: "zsb" },

  // Camiguin
  { code: "mbn", name: "Mambajao", provinceCode: "cam" },

  // Lanao del Norte
  { code: "iil", name: "Iligan City", provinceCode: "lan" },

  // Misamis Occidental
  { code: "orz", name: "Oroquieta City", provinceCode: "misw" },
  { code: "tngb", name: "Tangub City", provinceCode: "misw" },

  // Davao Oriental
  { code: "mtl", name: "Mati City", provinceCode: "davo" },

  // Davao Occidental
  { code: "mlt", name: "Malita", provinceCode: "davoc" },

  // Davao de Oro
  { code: "nbtr", name: "Nabunturan", provinceCode: "davor" },

  // North Cotabato
  { code: "kbn", name: "Kidapawan City", provinceCode: "nco" },
  { code: "mnt", name: "Midsayap", provinceCode: "nco" },

  // Sultan Kudarat
  { code: "is", name: "Isulan", provinceCode: "suk" },

  // Sarangani
  { code: "albe", name: "Alabel", provinceCode: "sar" },

  // Agusan del Sur
  { code: "spd", name: "San Francisco", provinceCode: "ags" },

  // Dinagat Islands
  { code: "sj", name: "San Jose", provinceCode: "din" },

  // Surigao del Sur
  { code: "tnd", name: "Tandag City", provinceCode: "sus" },
  { code: "bsg", name: "Bislig City", provinceCode: "sus" },

  // Basilan
  { code: "isb", name: "Isabela City", provinceCode: "bas" },

  // Maguindanao
  { code: "ctb", name: "Cotabato City", provinceCode: "mag" },

  // Sulu
  { code: "jlo", name: "Jolo", provinceCode: "sul" },

  // Tawi-Tawi
  { code: "bngs", name: "Bongao", provinceCode: "taw" },
];

export const barangays: Barangay[] = [
  // Manila
  { code: "mnl-1", name: "Barangay 1", cityCode: "mnl" },
  { code: "mnl-2", name: "Barangay 2", cityCode: "mnl" },
  { code: "mnl-3", name: "Barangay 3", cityCode: "mnl" },
  { code: "mnl-4", name: "Barangay 4", cityCode: "mnl" },
  { code: "mnl-5", name: "Barangay 5", cityCode: "mnl" },
  { code: "mnl-6", name: "Barangay 6", cityCode: "mnl" },
  { code: "mnl-7", name: "Barangay 7", cityCode: "mnl" },
  { code: "mnl-8", name: "Barangay 8", cityCode: "mnl" },
  { code: "mnl-9", name: "Barangay 9", cityCode: "mnl" },
  { code: "mnl-10", name: "Barangay 10", cityCode: "mnl" },

  // Quezon City
  { code: "qzn-1", name: "Barangay Bagong Silangan", cityCode: "qzn" },
  { code: "qzn-2", name: "Barangay Holy Spirit", cityCode: "qzn" },
  { code: "qzn-3", name: "Barangay Batasan Hills", cityCode: "qzn" },
  { code: "qzn-4", name: "Barangay Commonwealth", cityCode: "qzn" },
  { code: "qzn-5", name: "Barangay Cubao", cityCode: "qzn" },
  { code: "qzn-6", name: "Barangay Project 6", cityCode: "qzn" },
  { code: "qzn-7", name: "Barangay Tandang Sora", cityCode: "qzn" },
  { code: "qzn-8", name: "Barangay Diliman", cityCode: "qzn" },

  // Makati
  { code: "mtp-1", name: "Barangay Bel-Air", cityCode: "mtp" },
  { code: "mtp-2", name: "Barangay Poblacion", cityCode: "mtp" },
  { code: "mtp-3", name: "Barangay San Antonio", cityCode: "mtp" },
  { code: "mtp-4", name: "Barangay Guadalupe Nuevo", cityCode: "mtp" },

  // Taguig
  { code: "tag-1", name: "Barangay Bagumbayan", cityCode: "tag" },
  { code: "tag-2", name: "Barangay BGC", cityCode: "tag" },
  { code: "tag-3", name: "Barangay Pinagsama", cityCode: "tag" },
  { code: "tag-4", name: "Barangay Signal Village", cityCode: "tag" },

  // Pasig
  { code: "psg-1", name: "Barangay Kapitolyo", cityCode: "psg" },
  { code: "psg-2", name: "Barangay San Miguel", cityCode: "psg" },
  { code: "psg-3", name: "Barangay Ugong", cityCode: "psg" },

  // Caloocan
  { code: "cal-1", name: "Barangay 1", cityCode: "cal" },
  { code: "cal-2", name: "Barangay 2", cityCode: "cal" },
  { code: "cal-3", name: "Barangay 3", cityCode: "cal" },

  // Parañaque
  { code: "par-1", name: "Barangay Baclaran", cityCode: "par" },
  { code: "par-2", name: "Barangay Don Galo", cityCode: "par" },
  { code: "par-3", name: "Barangay San Dionisio", cityCode: "par" },

  // Las Piñas
  { code: "las-1", name: "Barangay Almanza Dos", cityCode: "las" },
  { code: "las-2", name: "Barangay BF Resort", cityCode: "las" },
  { code: "las-3", name: "Barangay Talon Uno", cityCode: "las" },

  // Muntinlupa
  { code: "mun-1", name: "Barangay Alabang", cityCode: "mun" },
  { code: "mun-2", name: "Barangay Ayala Alabang", cityCode: "mun" },
  { code: "mun-3", name: "Barangay Tunasan", cityCode: "mun" },

  // Mandaluyong
  { code: "mdy-1", name: "Barangay Addition Hills", cityCode: "mdy" },
  { code: "mdy-2", name: "Barangay Plainview", cityCode: "mdy" },

  // Marikina
  { code: "mk-1", name: "Barangay Concepcion Dos", cityCode: "mk" },
  { code: "mk-2", name: "Barangay Fortune", cityCode: "mk" },
  { code: "mk-3", name: "Barangay Marikina Heights", cityCode: "mk" },

  // Pasay
  { code: "psi-1", name: "Barangay 1", cityCode: "psi" },
  { code: "psi-2", name: "Barangay 2", cityCode: "psi" },

  // Valenzuela
  { code: "val-1", name: "Barangay Karuhatan", cityCode: "val" },
  { code: "val-2", name: "Barangay Malanday", cityCode: "val" },

  // Baguio
  { code: "bag-1", name: "Barangay Aurora Hill", cityCode: "bag" },
  { code: "bag-2", name: "Barangay Camp 7", cityCode: "bag" },
  { code: "bag-3", name: "Barangay Camp John Hay", cityCode: "bag" },
  { code: "bag-4", name: "Barangay Greenwater", cityCode: "bag" },
  { code: "bag-5", name: "Barangay Loakan Proper", cityCode: "bag" },

  // Dagupan
  { code: "dag-1", name: "Barangay Bacayao Norte", cityCode: "dag" },
  { code: "dag-2", name: "Barangay Bonuan Binloc", cityCode: "dag" },
  { code: "dag-3", name: "Barangay Lasip Chico", cityCode: "dag" },

  // Batangas City
  { code: "bats-1", name: "Barangay Poblacion", cityCode: "bats" },
  { code: "bats-2", name: "Barangay Cuta", cityCode: "bats" },
  { code: "bats-3", name: "Barangay Gulod Itaas", cityCode: "bats" },

  // Lipa
  { code: "lipa-1", name: "Barangay Pinagkawitan", cityCode: "lipa" },
  { code: "lipa-2", name: "Barangay Sabang", cityCode: "lipa" },
  { code: "lipa-3", name: "Barangay San Lucas", cityCode: "lipa" },

  // Dasmarinas
  { code: "dsm-1", name: "Barangay Sampaloc 1", cityCode: "dsm" },
  { code: "dsm-2", name: "Barangay San Agustin 1", cityCode: "dsm" },
  { code: "dsm-3", name: "Barangay San Simon", cityCode: "dsm" },

  // Bacoor
  { code: "bac-1", name: "Barangay Alima", cityCode: "bac" },
  { code: "bac-2", name: "Barangay Molino III", cityCode: "bac" },
  { code: "bac-3", name: "Barangay Talaba IV", cityCode: "bac" },

  // Calamba
  { code: "calb-1", name: "Barangay Real", cityCode: "calb" },
  { code: "calb-2", name: "Barangay Parian", cityCode: "calb" },
  { code: "calb-3", name: "Barangay Halang", cityCode: "calb" },

  // Antipolo
  { code: "ant-1", name: "Barangay San Jose", cityCode: "ant" },
  { code: "ant-2", name: "Barangay Santa Cruz", cityCode: "ant" },
  { code: "ant-3", name: "Barangay Cupang", cityCode: "ant" },

  // Cebu City
  { code: "ceb_c-1", name: "Barangay Lahug", cityCode: "ceb_c" },
  { code: "ceb_c-2", name: "Barangay Guadalupe", cityCode: "ceb_c" },
  { code: "ceb_c-3", name: "Barangay Talamban", cityCode: "ceb_c" },
  { code: "ceb_c-4", name: "Barangay Banilad", cityCode: "ceb_c" },

  // Davao City
  { code: "dvo-1", name: "Barangay Matina", cityCode: "dvo" },
  { code: "dvo-2", name: "Barangay Toril", cityCode: "dvo" },
  { code: "dvo-3", name: "Barangay Buhangin", cityCode: "dvo" },
  { code: "dvo-4", name: "Barangay Talomo", cityCode: "dvo" },

  // Cagayan de Oro
  { code: "cdo-1", name: "Barangay Carmen", cityCode: "cdo" },
  { code: "cdo-2", name: "Barangay Gusa", cityCode: "cdo" },
  { code: "cdo-3", name: "Barangay Macasandig", cityCode: "cdo" },

  // Iloilo City
  { code: "ilo_c-1", name: "Barangay Jaro", cityCode: "ilo_c" },
  { code: "ilo_c-2", name: "Barangay Lapuz", cityCode: "ilo_c" },
  { code: "ilo_c-3", name: "Barangay Mandurriao", cityCode: "ilo_c" },

  // Bacolod
  { code: "bcd-1", name: "Barangay Alijis", cityCode: "bcd" },
  { code: "bcd-2", name: "Barangay Mandalagan", cityCode: "bcd" },
  { code: "bcd-3", name: "Barangay Sum-ag", cityCode: "bcd" },

  // Zamboanga City
  { code: "zambo-1", name: "Barangay Ayala", cityCode: "zambo" },
  { code: "zambo-2", name: "Barangay Tetuan", cityCode: "zambo" },
  { code: "zambo-3", name: "Barangay Vitali", cityCode: "zambo" },

  // GenSan
  { code: "gensan-1", name: "Barangay Apopong", cityCode: "gensan" },
  { code: "gensan-2", name: "Barangay Bawing", cityCode: "gensan" },
  { code: "gensan-3", name: "Barangay Labangal", cityCode: "gensan" },

  // Angeles City
  { code: "ang-1", name: "Barangay Balibago", cityCode: "ang" },
  { code: "ang-2", name: "Barangay Malabanias", cityCode: "ang" },
  { code: "ang-3", name: "Barangay Pulung Cacutud", cityCode: "ang" },

  // San Fernando Pampanga
  { code: "sf-1", name: "Barangay Sindalan", cityCode: "sf" },
  { code: "sf-2", name: "Barangay San Agustin", cityCode: "sf" },
  { code: "sf-3", name: "Barangay Lourdes", cityCode: "sf" },
];

export function getProvincesByRegion(regionCode: string): Province[] {
  return provinces.filter((p) => p.regionCode === regionCode);
}

export function getCitiesByProvince(provinceCode: string): CityMunicipality[] {
  return cities.filter((c) => c.provinceCode === provinceCode);
}

export function getBarangaysByCity(cityCode: string): Barangay[] {
  return barangays.filter((b) => b.cityCode === cityCode);
}

export function getRegionName(code: string): string {
  return regions.find((r) => r.code === code)?.name || code;
}

export function getProvinceName(code: string): string {
  return provinces.find((p) => p.code === code)?.name || code;
}

export function getCityName(code: string): string {
  return cities.find((c) => c.code === code)?.name || code;
}

export function getBarangayName(code: string): string {
  return barangays.find((b) => b.code === code)?.name || code;
}

export function getCitiesByRegion(regionCode: string): CityMunicipality[] {
  const provinceCodes = provinces
    .filter((p) => p.regionCode === regionCode)
    .map((p) => p.code);
  return cities.filter((c) => provinceCodes.includes(c.provinceCode));
}
