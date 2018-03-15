
package eu.agileeng.ws.client;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for GetServiceSubscribed complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="GetServiceSubscribed">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="operatorId" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="virtualBoxId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "GetServiceSubscribed", propOrder = {
    "operatorId",
    "virtualBoxId"
})
public class GetServiceSubscribed {

    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected int operatorId;
    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected String virtualBoxId;

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

}
