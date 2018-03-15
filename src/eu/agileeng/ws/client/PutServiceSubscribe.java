
package eu.agileeng.ws.client;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for PutServiceSubscribe complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="PutServiceSubscribe">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="operatorId" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="virtualBoxId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="publicIp" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="pairingCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="services" type="{http://service.frontal.dematbox.sagemcom.com/}listServiceGroupsBean" minOccurs="0"/>
 *         &lt;element name="exclusiveness" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="operatorsAuthorized" type="{http://service.frontal.dematbox.sagemcom.com/}operatorAuthBean" minOccurs="0"/>
 *         &lt;element name="localServicesCredit" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "PutServiceSubscribe", propOrder = {
    "operatorId",
    "virtualBoxId",
    "customerName",
    "publicIp",
    "pairingCode",
    "services",
    "exclusiveness",
    "operatorsAuthorized",
    "localServicesCredit"
})
public class PutServiceSubscribe {

    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected int operatorId;
    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected String virtualBoxId;
    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected String customerName;
    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected String publicIp;
    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected String pairingCode;
    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected ListServiceGroupsBean services;
    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected Boolean exclusiveness;
    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected OperatorAuthBean operatorsAuthorized;
    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected int localServicesCredit;

    /**
     * Gets the value of the operatorId property.
     * 
     */
    public int getOperatorId() {
        return operatorId;
    }

    /**
     * Sets the value of the operatorId property.
     * 
     */
    public void setOperatorId(int value) {
        this.operatorId = value;
    }

    /**
     * Gets the value of the virtualBoxId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getVirtualBoxId() {
        return virtualBoxId;
    }

    /**
     * Sets the value of the virtualBoxId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setVirtualBoxId(String value) {
        this.virtualBoxId = value;
    }

    /**
     * Gets the value of the customerName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerName() {
        return customerName;
    }

    /**
     * Sets the value of the customerName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerName(String value) {
        this.customerName = value;
    }

    /**
     * Gets the value of the publicIp property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPublicIp() {
        return publicIp;
    }

    /**
     * Sets the value of the publicIp property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPublicIp(String value) {
        this.publicIp = value;
    }

    /**
     * Gets the value of the pairingCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPairingCode() {
        return pairingCode;
    }

    /**
     * Sets the value of the pairingCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPairingCode(String value) {
        this.pairingCode = value;
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
     * Gets the value of the exclusiveness property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isExclusiveness() {
        return exclusiveness;
    }

    /**
     * Sets the value of the exclusiveness property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setExclusiveness(Boolean value) {
        this.exclusiveness = value;
    }

    /**
     * Gets the value of the operatorsAuthorized property.
     * 
     * @return
     *     possible object is
     *     {@link OperatorAuthBean }
     *     
     */
    public OperatorAuthBean getOperatorsAuthorized() {
        return operatorsAuthorized;
    }

    /**
     * Sets the value of the operatorsAuthorized property.
     * 
     * @param value
     *     allowed object is
     *     {@link OperatorAuthBean }
     *     
     */
    public void setOperatorsAuthorized(OperatorAuthBean value) {
        this.operatorsAuthorized = value;
    }

    /**
     * Gets the value of the localServicesCredit property.
     * 
     */
    public int getLocalServicesCredit() {
        return localServicesCredit;
    }

    /**
     * Sets the value of the localServicesCredit property.
     * 
     */
    public void setLocalServicesCredit(int value) {
        this.localServicesCredit = value;
    }

}
