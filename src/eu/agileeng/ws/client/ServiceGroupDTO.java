
package eu.agileeng.ws.client;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;

import org.apache.tomcat.util.json.JSONException;
import org.apache.tomcat.util.json.JSONObject;


/**
 * <p>Java class for serviceGroupDTO complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="serviceGroupDTO">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="autocrop" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="autograyscale" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="color" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="deleteBlankPage" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="forceBinarize" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="improvedTimestamp" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="needImgImproved" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="needImgOrigin" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="ocr" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="originTimestamp" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="qualityFactor" type="{http://www.w3.org/2001/XMLSchema}int" minOccurs="0"/>
 *         &lt;element name="recipientString" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="resolution" type="{http://www.w3.org/2001/XMLSchema}int" minOccurs="0"/>
 *         &lt;element name="scanMode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="serviceId" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="serviceName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="serviceNameRepoGDriveId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="services" type="{http://service.frontal.dematbox.sagemcom.com/}listServiceGroupsBean" minOccurs="0"/>
 *         &lt;element name="textEnhancement" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="textOrientation" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="type" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "serviceGroupDTO", propOrder = {
    "autocrop",
    "autograyscale",
    "color",
    "deleteBlankPage",
    "forceBinarize",
    "improvedTimestamp",
    "needImgImproved",
    "needImgOrigin",
    "ocr",
    "originTimestamp",
    "qualityFactor",
    "recipientString",
    "resolution",
    "scanMode",
    "serviceId",
    "serviceName",
    "serviceNameRepoGDriveId",
    "services",
    "textEnhancement",
    "textOrientation",
    "type"
})
public class ServiceGroupDTO {

    protected Boolean autocrop;
    protected Boolean autograyscale;
    protected Boolean color;
    protected Boolean deleteBlankPage;
    protected Boolean forceBinarize;
    protected Boolean improvedTimestamp;
    protected Boolean needImgImproved;
    protected Boolean needImgOrigin;
    protected Boolean ocr;
    protected Boolean originTimestamp;
    protected Integer qualityFactor;
    protected String recipientString;
    protected Integer resolution;
    protected String scanMode;
    protected int serviceId;
    protected String serviceName;
    protected String serviceNameRepoGDriveId;
    protected ListServiceGroupsBean services;
    protected Boolean textEnhancement;
    protected Boolean textOrientation;
    protected String type;

    /**
     * Gets the value of the autocrop property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isAutocrop() {
        return autocrop;
    }

    /**
     * Sets the value of the autocrop property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setAutocrop(Boolean value) {
        this.autocrop = value;
    }

    /**
     * Gets the value of the autograyscale property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isAutograyscale() {
        return autograyscale;
    }

    /**
     * Sets the value of the autograyscale property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setAutograyscale(Boolean value) {
        this.autograyscale = value;
    }

    /**
     * Gets the value of the color property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isColor() {
        return color;
    }

    /**
     * Sets the value of the color property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setColor(Boolean value) {
        this.color = value;
    }

    /**
     * Gets the value of the deleteBlankPage property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isDeleteBlankPage() {
        return deleteBlankPage;
    }

    /**
     * Sets the value of the deleteBlankPage property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setDeleteBlankPage(Boolean value) {
        this.deleteBlankPage = value;
    }

    /**
     * Gets the value of the forceBinarize property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isForceBinarize() {
        return forceBinarize;
    }

    /**
     * Sets the value of the forceBinarize property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setForceBinarize(Boolean value) {
        this.forceBinarize = value;
    }

    /**
     * Gets the value of the improvedTimestamp property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isImprovedTimestamp() {
        return improvedTimestamp;
    }

    /**
     * Sets the value of the improvedTimestamp property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setImprovedTimestamp(Boolean value) {
        this.improvedTimestamp = value;
    }

    /**
     * Gets the value of the needImgImproved property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isNeedImgImproved() {
        return needImgImproved;
    }

    /**
     * Sets the value of the needImgImproved property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setNeedImgImproved(Boolean value) {
        this.needImgImproved = value;
    }

    /**
     * Gets the value of the needImgOrigin property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isNeedImgOrigin() {
        return needImgOrigin;
    }

    /**
     * Sets the value of the needImgOrigin property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setNeedImgOrigin(Boolean value) {
        this.needImgOrigin = value;
    }

    /**
     * Gets the value of the ocr property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isOcr() {
        return ocr;
    }

    /**
     * Sets the value of the ocr property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setOcr(Boolean value) {
        this.ocr = value;
    }

    /**
     * Gets the value of the originTimestamp property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isOriginTimestamp() {
        return originTimestamp;
    }

    /**
     * Sets the value of the originTimestamp property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setOriginTimestamp(Boolean value) {
        this.originTimestamp = value;
    }

    /**
     * Gets the value of the qualityFactor property.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getQualityFactor() {
        return qualityFactor;
    }

    /**
     * Sets the value of the qualityFactor property.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setQualityFactor(Integer value) {
        this.qualityFactor = value;
    }

    /**
     * Gets the value of the recipientString property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRecipientString() {
        return recipientString;
    }

    /**
     * Sets the value of the recipientString property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRecipientString(String value) {
        this.recipientString = value;
    }

    /**
     * Gets the value of the resolution property.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getResolution() {
        return resolution;
    }

    /**
     * Sets the value of the resolution property.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setResolution(Integer value) {
        this.resolution = value;
    }

    /**
     * Gets the value of the scanMode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getScanMode() {
        return scanMode;
    }

    /**
     * Sets the value of the scanMode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setScanMode(String value) {
        this.scanMode = value;
    }

    /**
     * Gets the value of the serviceId property.
     * 
     */
    public int getServiceId() {
        return serviceId;
    }

    /**
     * Sets the value of the serviceId property.
     * 
     */
    public void setServiceId(int value) {
        this.serviceId = value;
    }

    /**
     * Gets the value of the serviceName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getServiceName() {
        return serviceName;
    }

    /**
     * Sets the value of the serviceName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setServiceName(String value) {
        this.serviceName = value;
    }

    /**
     * Gets the value of the serviceNameRepoGDriveId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getServiceNameRepoGDriveId() {
        return serviceNameRepoGDriveId;
    }

    /**
     * Sets the value of the serviceNameRepoGDriveId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setServiceNameRepoGDriveId(String value) {
        this.serviceNameRepoGDriveId = value;
    }

    /**
     * Gets the value of the services property.
     * 
     * @return
     *     possible object is
     *     {@link ListServiceGroupsBean }
     *     
     */
    public ListServiceGroupsBean getServices() {
        return services;
    }

    /**
     * Sets the value of the services property.
     * 
     * @param value
     *     allowed object is
     *     {@link ListServiceGroupsBean }
     *     
     */
    public void setServices(ListServiceGroupsBean value) {
        this.services = value;
    }

    /**
     * Gets the value of the textEnhancement property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isTextEnhancement() {
        return textEnhancement;
    }

    /**
     * Sets the value of the textEnhancement property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setTextEnhancement(Boolean value) {
        this.textEnhancement = value;
    }

    /**
     * Gets the value of the textOrientation property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isTextOrientation() {
        return textOrientation;
    }

    /**
     * Sets the value of the textOrientation property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setTextOrientation(Boolean value) {
        this.textOrientation = value;
    }

    /**
     * Gets the value of the type property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getType() {
        return type;
    }

    /**
     * Sets the value of the type property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setType(String value) {
        this.type = value;
    }
    
    public void create(JSONObject srv) throws JSONException {
    	
    	this.setServiceId(srv.optInt("id"));
    	this.setServiceName(srv.optString("name"));
    	this.setType(srv.optString("type"));
    	
    	if (srv.optJSONArray("services") != null) {
    		if (this.getServices() == null) this.setServices(new ListServiceGroupsBean());
    		
    		this.getServices().createServiceList(srv.optJSONArray("services"));
    	}
    }
    
    /**
     * 
     * Generate JSONObject
     * 
     * @return JSONObject
     * @throws JSONException
     */
    public JSONObject toJSONObject() throws JSONException {
    	JSONObject service = new JSONObject();
    	
    	service.put("id", this.getServiceId());
    	service.put("name", this.getServiceName());
    	service.put("type", this.getType());
    	
    	if (this.getServices() == null) this.setServices(new ListServiceGroupsBean());
    		
    	service.put("services", this.getServices().toJSONArray());
    	
    	return service;
    }

}
