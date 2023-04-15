// Copyright 2012-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Licensed under the Apache License, Version 2.0.

package com.amazonaws.samples;

import java.util.HashMap;
import java.util.Map;
import java.io.File;
import java.util.Iterator;

import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.PutItemOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

//referenced from lab code week 4
public class MusicItemOps {

    public static void main(String[] args) throws Exception {

        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
        	.withRegion(Regions.US_EAST_1)
            .withCredentials(new ProfileCredentialsProvider("default"))
            .build();

        
        DynamoDB dynamoDB = new DynamoDB(client);
       
        Table table = dynamoDB.getTable("music");
        
        JsonParser parser = new JsonFactory().createParser(new File("src/main/java/com/amazonaws/samples/a1.json"));
        JsonNode rootNode = new ObjectMapper().readTree(parser);
        Iterator<JsonNode> iter = rootNode.iterator();
        ObjectNode currentNode;
        
        while (iter.hasNext()) {
            currentNode = (ObjectNode) iter.next();
            
            String title = currentNode.path("title").asText();
            String artist = currentNode.path("artist").asText();
            int year = currentNode.path("year").asInt();
            String web_url = currentNode.path("web_url").asText();
            String img_url = currentNode.path("img_url").asText();

        try {
            System.out.println("Adding item...");
            PutItemOutcome outcome = table
                .putItem(new Item().withPrimaryKey("title", title, "artist", artist).withInt("year", year).withString("web_url", web_url).withString("img_url", img_url));

            System.out.println("Item added:\n" + outcome.getPutItemResult());

        }
        catch (Exception e) {
            System.err.println("Unable to add item: " +  title);
            System.err.println(e.getMessage());
        }
      }

    }
}
