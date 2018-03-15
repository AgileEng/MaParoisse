
package eu.agileeng.ws.client;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for GetServiceListResponse complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="GetServiceListResponse">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="serviceList" type="{http://service.frontal.dematbox.sagemcom.com/}serviceListBean" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "GetServiceListResponse", propOrder = {
    "serviceList"
})
public class GetServiceListResponse {

    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected ServiceListBean serviceList;

    /**
     * Gets the value of the serviceList property.
     * 
     * @return
     *     possible object is
     *     {@link ServiceListBean }
     *     
     */
    public ServiceListBean getServiceList() {
        return serviceList;
    }

    /**
     * Sets the value of the serviceList property.
     * 
     * @param value
     *     allowed object is
     *     {@link ServiceListBean }
     *     
     */
    public void setServiceList(ServiceListBean value) {
        this.serviceList = value;
    }

}
