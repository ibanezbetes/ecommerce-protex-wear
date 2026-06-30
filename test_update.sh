aws dynamodb update-item \
    --table-name EcommerceProtexWearStack-ProtexWearTableF73247B0-790OR4SHOYCU \
    --key '{"PK": {"S": "ORDER#USER#92b5f404-f041-7082-b52a-b086c8b585ff"}, "SK": {"S": "ORDER#ORD-1782831417592"}}' \
    --update-expression "SET #st = :status" \
    --expression-attribute-names '{"#st": "status"}' \
    --expression-attribute-values '{":status": {"S": "CONFIRMED"}}' \
    --return-values ALL_NEW
