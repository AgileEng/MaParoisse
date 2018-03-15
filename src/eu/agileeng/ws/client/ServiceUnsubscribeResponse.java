
package eu.agileeng.ws.client;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ServiceUnsubscribeResponse complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ServiceUnsubscribeResponse">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="errorReturn" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ServiceUnsubscribeResponse", propOrder = {
    "errorReturn"
})
public class ServiceUnsubscribeResponse {

    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected String errorReturn;

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

}
