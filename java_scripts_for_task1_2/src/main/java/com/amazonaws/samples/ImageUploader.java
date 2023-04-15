package com.amazonaws.samples;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;

public class ImageUploader {

	public static void main(String[] args) {
	    
	    ObjectMapper mapper = new ObjectMapper();
	    List<Artist> artists = new ArrayList<>();

	    try {
	        File file = new File("C:/Users/User/eclipse-workspace/assignment1/src/main/java/com/amazonaws/samples/a1.json");
	        InputStream inputStream = new FileInputStream(file);

	        List<Object> objects = mapper.readValue(inputStream, new TypeReference<List<Object>>() {});
	        
	        for (Object object : objects) {
	            Artist artist = mapper.convertValue(object, Artist.class);
	            artists.add(artist);
	        }

	        System.out.println("Loaded artists: " + artists);
	    } catch (IOException e) {
	        e.printStackTrace();
	        System.exit(1);
        }
        
        
        AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                .withRegion(Regions.US_EAST_1)
                .withCredentials(new ProfileCredentialsProvider("default"))
                .build();
        String bucketName = "mybucket-s3885529";
        
        for (Artist artist : artists) {
            try {
                URL url = new URL(artist.getImgUrl());
                InputStream inputStream = url.openStream();
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentType("image/jpeg");
                metadata.setContentLength(url.openConnection().getContentLengthLong());
                String filename = artist.getArtist() + ".jpg";
                PutObjectRequest request = new PutObjectRequest(bucketName, filename, inputStream, metadata);
                s3Client.putObject(request);
                System.out.println("Updated " + filename + " to S3 bucket " + bucketName);
            } catch (IOException e) {
                System.err.println("Failed to upload " + artist.getImgUrl() + ": " + e.getMessage());
            }
        }
    }
    
    private static class Artist {
        private String title;
        private String artist;
        private int year;
        @JsonProperty("web_url")
        private String web_url; 
        @JsonProperty("img_url")
        private String img_url;
        
        public String getTitle() {
            return title;
        }
        public void setTitle(String title) {
            this.title = title;
        }
        public String getArtist() {
            return artist;
        }
        public void setArtist(String artist) {
            this.artist = artist;
        }
        public int getYear() {
            return year;
        }
        public void setYear(int year) {
            this.year = year;
        }
        public String getWebUrl() {
            return web_url;
        }
        public void setWebUrl(String web_url) {
            this.web_url = web_url;
        }
        public String getImgUrl() {
            return img_url;
        }
        public void setImgUrl(String img_url) {
            this.img_url = img_url;
        }
    }

}
