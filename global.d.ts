type User = {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
};

type Reservation = {
    id?: string;
    dateTime: Number;
    otherOBTalk: string;
    otherTalkTheme?: string;
    talkThemes: string[];
    howFoundMurakami: string;
};

interface CoachName {
    coachName: string;
}

type radioOption = {
    value: string;
    label: string;
    radioName: string;
};

type checkBoxOption = {
    value: string;
    label: string;
    radioName: string;
};

declare module "remark-html" {
    const html: any;
    export default html;
}

const json = {
    "announcements": [{
        "id": 652,
        "hokensha_bango": 36062047,
        "title": "FactoryGirlお知らせタイトル38",
        "author_name": "けんぽ",
        "external_url": null,
        "issued_at": "2020-11-11T00:00:00.000+09:00",
        "published_at": "1970-01-01T00:00:00.000+09:00",
        "user_targeted": false,
        "own_url": "http://www.example.com/announcements/7d4e527cf706460d177ab91ea7f36987",
        "status": "drafted",
        "target_platforms": [],
        "other_platform_announcement_ids": [],
        "destination_condition": {
            "hokensha_all": false,
            "kenpo_all": true,
            "jichitai_all": false,
            "organization_all": true,
            "hokensha_bangos": [],
            "organization_ids": [],
            "prefecture_numbers": []
        }
    }, {
        "id": 651,
        "hokensha_bango": 72567143,
        "title": "FactoryGirlお知らせタイトル37",
        "author_name": "けんぽ",
        "external_url": null,
        "issued_at": "2020-11-11T00:00:00.000+09:00",
        "published_at": "1970-01-01T00:00:00.000+09:00",
        "user_targeted": false,
        "own_url": "http://www.example.com/announcements/f10c354da87b114c117243d89ed39185",
        "status": "drafted",
        "target_platforms": [],
        "other_platform_announcement_ids": [],
        "destination_condition": {
            "hokensha_all": false,
            "kenpo_all": true,
            "jichitai_all": false,
            "organization_all": true,
            "hokensha_bangos": [],
            "organization_ids": [],
            "prefecture_numbers": []
        }
    }, {
        "id": 650,
        "hokensha_bango": 46902382,
        "title": "FactoryGirlお知らせタイトル36",
        "author_name": "けんぽ",
        "external_url": null,
        "issued_at": "2020-11-11T00:00:00.000+09:00",
        "published_at": "1970-01-01T00:00:00.000+09:00",
        "user_targeted": false,
        "own_url": "http://www.example.com/announcements/acc9edfbd1d1e25b93f0822dbdc275dd",
        "status": "drafted",
        "target_platforms": [],
        "other_platform_announcement_ids": [],
        "destination_condition": {
            "hokensha_all": false,
            "kenpo_all": true,
            "jichitai_all": false,
            "organization_all": false,
            "hokensha_bangos": [],
            "organization_ids": [],
            "prefecture_numbers": [1]
        }
    }, {
        "id": 649,
        "hokensha_bango": 75313651,
        "title": "FactoryGirlお知らせタイトル35",
        "author_name": "けんぽ",
        "external_url": null,
        "issued_at": "2020-11-11T00:00:00.000+09:00",
        "published_at": "1970-01-01T00:00:00.000+09:00",
        "user_targeted": false,
        "own_url": "http://www.example.com/announcements/1fb70c82eb79ab8f3559f20ffdce1ab3",
        "status": "drafted",
        "target_platforms": [],
        "other_platform_announcement_ids": [],
        "destination_condition": {
            "hokensha_all": false,
            "kenpo_all": true,
            "jichitai_all": false,
            "organization_all": false,
            "hokensha_bangos": [],
            "organization_ids": [],
            "prefecture_numbers": [1]
        }
    }, {
        "id": 648,
        "hokensha_bango": 93495670,
        "title": "FactoryGirlお知らせタイトル34",
        "author_name": "けんぽ",
        "external_url": null,
        "issued_at": "2020-11-11T00:00:00.000+09:00",
        "published_at": "1970-01-01T00:00:00.000+09:00",
        "user_targeted": false,
        "own_url": "http://www.example.com/announcements/0f4242d613c21c674973fd44375527da",
        "status": "drafted",
        "target_platforms": [],
        "other_platform_announcement_ids": [],
        "destination_condition": {
            "hokensha_all": false,
            "kenpo_all": true,
            "jichitai_all": false,
            "organization_all": false,
            "hokensha_bangos": [],
            "organization_ids": [],
            "prefecture_numbers": [1]
        }
    }, {
        "id": 647,
        "hokensha_bango": 23894106,
        "title": "FactoryGirlお知らせタイトル33",
        "author_name": "けんぽ",
        "external_url": null,
        "issued_at": "2020-11-11T00:00:00.000+09:00",
        "published_at": "1970-01-01T00:00:00.000+09:00",
        "user_targeted": false,
        "own_url": "http://www.example.com/announcements/b67f4c0efc053f0b19e42b136358c410",
        "status": "drafted",
        "target_platforms": [],
        "other_platform_announcement_ids": [],
        "destination_condition": {
            "hokensha_all": false,
            "kenpo_all": true,
            "jichitai_all": false,
            "organization_all": false,
            "hokensha_bangos": [],
            "organization_ids": [],
            "prefecture_numbers": [1]
        }
    }, {
        "id": 646,
        "hokensha_bango": 59002063,
        "title": "FactoryGirlお知らせタイトル32",
        "author_name": "けんぽ",
        "external_url": null,
        "issued_at": "2020-11-11T00:00:00.000+09:00",
        "published_at": "1970-01-01T00:00:00.000+09:00",
        "user_targeted": false,
        "own_url": "http://www.example.com/announcements/46d0c36503be8441a895af5924b6be19",
        "status": "drafted",
        "target_platforms": [],
        "other_platform_announcement_ids": [],
        "destination_condition": {
            "hokensha_all": false,
            "kenpo_all": false,
            "jichitai_all": false,
            "organization_all": false,
            "hokensha_bangos": [],
            "organization_ids": [1, 2],
            "prefecture_numbers": [1]
        }
    }, {
        "id": 645,
        "hokensha_bango": 93247618,
        "title": "FactoryGirlお知らせタイトル31",
        "author_name": "けんぽ",
        "external_url": null,
        "issued_at": "2020-11-11T00:00:00.000+09:00",
        "published_at": "1970-01-01T00:00:00.000+09:00",
        "user_targeted": false,
        "own_url": "http://www.example.com/announcements/ae1fffcd7c45c056ca9450ca17526448",
        "status": "drafted",
        "target_platforms": [],
        "other_platform_announcement_ids": [],
        "destination_condition": {
            "hokensha_all": false,
            "kenpo_all": false,
            "jichitai_all": false,
            "organization_all": false,
            "hokensha_bangos": [],
            "organization_ids": [1, 2],
            "prefecture_numbers": [1]
        }
    }, {
        "id": 644,
        "hokensha_bango": 97044994,
        "title": "FactoryGirlお知らせタイトル30",
        "author_name": "けんぽ",
        "external_url": null,
        "issued_at": "2020-11-11T00:00:00.000+09:00",
        "published_at": "1970-01-01T00:00:00.000+09:00",
        "user_targeted": false,
        "own_url": "http://www.example.com/announcements/a11c8d58f1808462de27853f34c0a135",
        "status": "drafted",
        "target_platforms": [],
        "other_platform_announcement_ids": [],
        "destination_condition": {
            "hokensha_all": false,
            "kenpo_all": false,
            "jichitai_all": false,
            "organization_all": false,
            "hokensha_bangos": [],
            "organization_ids": [],
            "prefecture_numbers": [2]
        }
    }, {
        "id": 643,
        "hokensha_bango": 74430950,
        "title": "FactoryGirlお知らせタイトル29",
        "author_name": "けんぽ",
        "external_url": null,
        "issued_at": "2020-11-11T00:00:00.000+09:00",
        "published_at": "1970-01-01T00:00:00.000+09:00",
        "user_targeted": false,
        "own_url": "http://www.example.com/announcements/c2d28156af41ce6a9d6f23078daee89d",
        "status": "drafted",
        "target_platforms": [],
        "other_platform_announcement_ids": [],
        "destination_condition": {
            "hokensha_all": false,
            "kenpo_all": false,
            "jichitai_all": false,
            "organization_all": false,
            "hokensha_bangos": [],
            "organization_ids": [],
            "prefecture_numbers": [2]
        }
    }, {
        "id": 642,
        "hokensha_bango": 62033683,
        "title": "FactoryGirlお知らせタイトル28",
        "author_name": "けんぽ",
        "external_url": null,
        "issued_at": "2020-11-11T00:00:00.000+09:00",
        "published_at": "1970-01-01T00:00:00.000+09:00",
        "user_targeted": false,
        "own_url": "http://www.example.com/announcements/ebdc06b36493b57e74b8b99ae9614238",
        "status": "drafted",
        "target_platforms": [],
        "other_platform_announcement_ids": [],
        "destination_condition": {
            "hokensha_all": false,
            "kenpo_all": false,
            "jichitai_all": false,
            "organization_all": true,
            "hokensha_bangos": [],
            "organization_ids": [],
            "prefecture_numbers": []
        }
    }, {
        "id": 641,
        "hokensha_bango": 76568226,
        "title": "FactoryGirlお知らせタイトル27",
        "author_name": "けんぽ",
        "external_url": null,
        "issued_at": "2020-11-11T00:00:00.000+09:00",
        "published_at": "1970-01-01T00:00:00.000+09:00",
        "user_targeted": false,
        "own_url": "http://www.example.com/announcements/e2049e88423c3e58fd9bac630391dac9",
        "status": "drafted",
        "target_platforms": [],
        "other_platform_announcement_ids": [],
        "destination_condition": {
            "hokensha_all": false,
            "kenpo_all": false,
            "jichitai_all": false,
            "organization_all": true,
            "hokensha_bangos": [],
            "organization_ids": [],
            "prefecture_numbers": []
        }
    }, {
        "id": 640,
        "hokensha_bango": 58301038,
        "title": "FactoryGirlお知らせタイトル26",
        "author_name": "けんぽ",
        "external_url": null,
        "issued_at": "2020-11-11T00:00:00.000+09:00",
        "published_at": "1970-01-01T00:00:00.000+09:00",
        "user_targeted": false,
        "own_url": "http://www.example.com/announcements/8b689902afe9ae475e38b0734d84e272",
        "status": "drafted",
        "target_platforms": [],
        "other_platform_announcement_ids": [],
        "destination_condition": {
            "hokensha_all": true,
            "kenpo_all": false,
            "jichitai_all": false,
            "organization_all": false,
            "hokensha_bangos": [],
            "organization_ids": [],
            "prefecture_numbers": []
        }
    }, {
        "id": 639,
        "hokensha_bango": 68349976,
        "title": "FactoryGirlお知らせタイトル25",
        "author_name": "けんぽ",
        "external_url": null,
        "issued_at": "2020-11-11T00:00:00.000+09:00",
        "published_at": "1970-01-01T00:00:00.000+09:00",
        "user_targeted": false,
        "own_url": "http://www.example.com/announcements/ca528d5646be489d35ed3c157aa82674",
        "status": "drafted",
        "target_platforms": [],
        "other_platform_announcement_ids": [],
        "destination_condition": {
            "hokensha_all": true,
            "kenpo_all": false,
            "jichitai_all": false,
            "organization_all": false,
            "hokensha_bangos": [],
            "organization_ids": [],
            "prefecture_numbers": []
        }
    }, {
        "id": 638,
        "hokensha_bango": 43224170,
        "title": "FactoryGirlお知らせタイトル24",
        "author_name": "けんぽ",
        "external_url": null,
        "issued_at": "2020-11-11T00:00:00.000+09:00",
        "published_at": "1970-01-01T00:00:00.000+09:00",
        "user_targeted": false,
        "own_url": "http://www.example.com/announcements/00f9c67c19980cb9189971de89b5dc11",
        "status": "drafted",
        "target_platforms": [],
        "other_platform_announcement_ids": [],
        "destination_condition": {
            "hokensha_all": false,
            "kenpo_all": true,
            "jichitai_all": false,
            "organization_all": false,
            "hokensha_bangos": [],
            "organization_ids": [],
            "prefecture_numbers": []
        }
    }], "announcements_count": 38
}