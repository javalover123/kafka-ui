package com.provectus.kafka.ui.strategy.ksqlStatement;

import com.fasterxml.jackson.databind.JsonNode;
import com.provectus.kafka.ui.model.KsqlResponseTable;
import org.springframework.stereotype.Component;


@Component
public class ShowPropertiesStrategy extends KsqlStatementStrategy {
    private final String requestPath = "/ksql";
    private final String responseValueKey = "properties";

    @Override
    public KsqlResponseTable serializeResponse(JsonNode response) {
        return serializeTableResponse(response, responseValueKey);
    }

    @Override
    protected String getRequestPath() {
        return requestPath;
    }

    @Override
    protected String getTestRegExp() {
        return "show properties;";
    }
}
