const mock_data = [
    // {
    //     "id": 0,
    //     "cin": 0,
    //     "fullname": "abdelkader",
    //     "phone_number": "50682400",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 20000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-11",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "wael"
    // },
    // {
    //     "id": 1,
    //     "cin": 0,
    //     "fullname": "raed ayed",
    //     "phone_number": "99429303",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 20000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-11",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "wael"
    // },
    // {
    //     "id": 2,
    //     "cin": 0,
    //     "fullname": "marwen bennour",
    //     "phone_number": "54026511",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 19000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-11",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "bilel"
    // },
    // {
    //     "id": 3,
    //     "cin": 0,
    //     "fullname": "moetez hamrouni",
    //     "phone_number": "90402234",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 17500,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-11",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "walid"
    // },
    // {
    //     "id": 3,
    //     "cin": 0,
    //     "fullname": "hichem jebali",
    //     "phone_number": "50949293",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 17500,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-11",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "walid"
    // },
    // {
    //     "id": 4,
    //     "cin": 0,
    //     "fullname": "mohamed madhkour",
    //     "phone_number": "9486022",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 17000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-11",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "wael"
    // },
    // {
    //     "id": 0,
    //     "cin": 14363809,
    //     "fullname": "mohamed khalil saidani",
    //     "phone_number": "97631529",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 20000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-11",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "bilel"
    // },
    // {
    //     "id": 1,
    //     "cin": 14350568,
    //     "fullname": "abdehalim haaouami",
    //     "phone_number": "50718919",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 18000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-11",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "waild"
    // },
    // {
    //     "id": 2,
    //     "cin": 6051805,
    //     "fullname": "gharbi walid",
    //     "phone_number": "47002352",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 20000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-11",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "dhouha"
    // },
    // {
    //     "id": 3,
    //     "cin": 14412867,
    //     "fullname": "montassar chrif",
    //     "phone_number": "27793350",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 16000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-11",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "bilel"
    // },
    // {
    //     "id": 1,
    //     "cin": 0,
    //     "fullname": "malek dahrch",
    //     "phone_number": "54042309",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 16000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-14",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "walid"
    // },
    // {
    //     "id": 2,
    //     "cin": 0,
    //     "fullname": "adel arfa",
    //     "phone_number": "53545492",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 17000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-14",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "walid"
    // },
    // {
    //     "id": 3,
    //     "cin": 0,
    //     "fullname": "mohamed cherif zauaoui",
    //     "phone_number": "26970265/96810373",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 18000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-14",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "bilel"
    // },
    // {
    //     "id": 4,
    //     "cin": 0,
    //     "fullname": "bilel mousbehi",
    //     "phone_number": "22980244",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 18500,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-14",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "EMNA VISA"
    // },
    // {
    //     "id": 5,
    //     "cin": 0,
    //     "fullname": "abdessamiaa neili",
    //     "phone_number": "93122452/58380026",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 18000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-14",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "bilel"
    // },
    // {
    //     "id": 0,
    //     "cin": 0,
    //     "fullname": "imen amdouni",
    //     "phone_number": "29370635",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 16800,
    //     "advenced_payment": 2800,
    //     "issue_date": "2024-11-18",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "walid"
    // },
    // {
    //     "id": 1,
    //     "cin": 0,
    //     "fullname": "aymen hamemi",
    //     "phone_number": "95121983",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 18000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-18",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "bilel"
    // }, {
    //     "id": 2,
    //     "cin": 0,
    //     "fullname": "mohamed ali mgaidi",
    //     "phone_number": "56647670",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 16000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-18",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "bilel"
    // },
    // {
    //     "id": 3,
    //     "cin": 0,
    //     "fullname": "firas graidia",
    //     "phone_number": "90223220",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 19000,
    //     "advenced_payment": 2900,
    //     "issue_date": "2024-11-18",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "walid"
    // },
    // {
    //     "id": 4,
    //     "cin": 0,
    //     "fullname": "rayen chihi",
    //     "phone_number": "54527105",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 19000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-18",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "bilel"
    // },
    // {
    //     "id": 0,
    //     "cin": 0,
    //     "fullname": "mohamed bouhada",
    //     "phone_number": "27293341",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 16000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-22",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "wael"
    // },
    // {
    //     "id": 1,
    //     "cin": 0,
    //     "fullname": "tarek hamemi",
    //     "phone_number": "24046260",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 16000,
    //     "advenced_payment": 3000,
    //     "issue_date": "2024-11-22",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "wael"
    // },
    // {
    //     "id": 2,
    //     "cin": 0,
    //     "fullname": "mohamed boukari",
    //     "phone_number": "55070195",
    //     "target_country": "ROMANIA",
    //     "required_job": "livreur",
    //     "discount": 0,
    //     "total_amount": 0,
    //     "advenced_payment": 5000,
    //     "issue_date": "2024-11-22",
    //     "due_date": "2025-01-01",
    //     "status": "PENDING",
    //     "agent": "walid"
    // },
    {
        "id": 0,
        "cin": 0,
        "fullname": "wassim sallemi",
        "phone_number": "52966902",
        "target_country": "ROMANIA",
        "required_job": "livreur",
        "discount": 0,
        "total_amount": 16000,
        "advenced_payment": 3000,
        "issue_date": "2024-11-25",
        "due_date": "2025-01-01",
        "status": "PENDING",
        "agent": "wael"
    },
  {
        "id": 1,
        "cin": 0,
        "fullname": "mohamed boughdira",
        "phone_number": "22022024",
        "target_country": "ROMANIA",
        "required_job": "livreur",
        "discount": 0,
        "total_amount": 16000,
        "advenced_payment": 2000,
        "issue_date": "2024-11-25",
        "due_date": "2025-01-01",
        "status": "PENDING",
        "agent": "bilel"
    },  {
        "id": 3,
        "cin": 0,
        "fullname": "nawres bouabid",
        "phone_number": "28689469",
        "target_country": "ROMANIA",
        "required_job": "livreur",
        "discount": 0,
        "total_amount": 16000,
        "advenced_payment": 3000,
        "issue_date": "2024-11-25",
        "due_date": "2025-01-01",
        "status": "PENDING",
        "agent": "wael"
    },
]
export default mock_data;