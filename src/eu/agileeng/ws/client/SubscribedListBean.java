
package eu.agileeng.ws.client;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for subscribedListBean complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="subscribedListBean">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="customerName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="errorReturn" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="exclusiveness" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="localServiceCredit" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="operatorsAuthorized" type="{http://service.frontal.dematbox.sagemcom.com/}operatorAuthBean" minOccurs="0"/>
 *         &lt;element name="services" type="{http://service.frontal.dematbox.sagemcom.com/}listServiceGroupsBean" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "subscribedListBean", propOrder = {
    "customerName",
    "errorReturn",
    "exclusiveness",
    "localServiceCredit",
    "operatorsAuthorized",
    "services"
})
public class SubscribedListBean {

    protected String customerName;
    protected String errorReturn;
    protected Boolean exclusiveness;
    protected int localServiceCredit;
    protected OperatorAuthBean operatorsAuthorized;
    protected ListServiceGroupsBean services;

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
     * Gets the value of the errorReturn property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getErrorReturn() {
        return errorReturn;
    }

    /**
     * Sets the value of the errorReturn property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setErrorReturn(String value) {
        this.errorReturn = value;
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
     * Gets the value of the localServiceCredit property.
     * 
     */
    public int getLocalServiceCredit() {
        return localServiceCredit;
    }

    /**
     * Sets the value of the localServiceCredit property.
     * 
     */
    public void setLocalServiceCredit(int value) {
        this.localServiceCredit = value;
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

}
